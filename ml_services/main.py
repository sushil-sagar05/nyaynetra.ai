from flask import Flask, request, jsonify
import os
import tempfile
import requests
import hashlib
from extraction.pdf_reader import load_pdf
from extraction.text_preprocessor import text_preprocessing
import dotenv

dotenv.load_dotenv()
HF_TOKEN = os.getenv('huggingface_token')

main = Flask(__name__)
HF_BASE_URL = os.getenv('HF_ANALYZE_URL')

DOC_CACHE = {}
session = requests.Session()

def compute_doc_id(file_bytes):
    """Generate consistent doc ID from file content"""
    return hashlib.sha256(file_bytes).hexdigest()[:16]

def extract_text_from_file(file_bytes):
    """Extract text from PDF bytes"""
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
        temp_file.write(file_bytes)
        temp_path = temp_file.name

    try:
        pdf = load_pdf(temp_path)
        full_text = text_preprocessing(pdf)
        return full_text
    finally:
        os.remove(temp_path)

def call_unified_analysis(full_text, doc_id, timeout=600): 
    """Send text to HF Space for complete analysis with aligned doc_id"""
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "document_text": full_text,
        "force_doc_id": doc_id 
    }
    
    try:
        analysis_url = f"{HF_BASE_URL}/analyze_document"
        print(f"Sending analysis request to: {analysis_url}")
        print(f"Using doc_id: {doc_id}") 
        
        response = session.post(analysis_url, headers=headers, json=payload, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"HF Space request failed: {e}")
        raise Exception(f"Analysis failed: {str(e)}")

@main.route('/analysis', methods=['GET', 'POST'])
def analyze():
    """Document analysis endpoint with vector storage"""
    if request.method == 'GET':
        return jsonify({
            'service': 'Legal Document Analysis API',
            'version': '1.0.0',
            'status': 'running',
            'features': ['Document Analysis', 'Vector Storage', 'Chat Ready'],
            'endpoints': {
                '/analysis': 'Document analysis with vector storage',
                '/chat': 'Chat with analyzed documents'
            },
            'hf_base_url': HF_BASE_URL,
            'analysis_endpoint': f"{HF_BASE_URL}/analyze_document",
            'chat_endpoint': f"{HF_BASE_URL}/chat"
        })
    
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        file_bytes = file.read()
        print(f"Processing uploaded file: {file.filename}")
    elif request.is_json:
        data = request.get_json()
        document_url = data.get("documentUrl")
        if not document_url:
            return jsonify({'error': 'No file or document URL provided'}), 400
        
        print(f"Downloading document from: {document_url}")
        response = requests.get(document_url, timeout=60)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download the document'}), 400
        file_bytes = response.content
    else:
        return jsonify({'error': 'No file or document URL provided'}), 400
    doc_id = compute_doc_id(file_bytes)
    
    if doc_id in DOC_CACHE:
        print(f"Using cached analysis for doc_id: {doc_id}")
        return jsonify(DOC_CACHE[doc_id]), 200

    try:
        print(f"Processing new document with doc_id: {doc_id}")
        full_text = extract_text_from_file(file_bytes)
        print(f"Extracted text length: {len(full_text)} characters")
        result = call_unified_analysis(full_text, doc_id)
        DOC_CACHE[doc_id] = result
        
        print(f"Document analysis completed. Chat ready: {result.get('chat_ready', False)}")
        print(f"Returned doc_id: {result.get('doc_id', 'NOT_FOUND')}")  
        
        return jsonify(result), 200

    except Exception as e:
        print(f"Error in analysis: {e}")
        return jsonify({'error': str(e)}), 500

@main.route('/chat', methods=['POST'])
def chat():
    """Chat with analyzed document using RAG"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        message = data.get('message')
        document_id = data.get('document_id')
        conversation_history = data.get('conversation_history', [])
        
        if not message or not document_id:
            return jsonify({'error': 'Message and document_id are required'}), 400
        
        print(f"Processing chat request for doc_id: {document_id}")
        print(f"User message: {message}")
        headers = {
            "Authorization": f"Bearer {HF_TOKEN}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "message": message,
            "document_id": document_id,
            "conversation_history": conversation_history
        }
        
        chat_url = f"{HF_BASE_URL}/chat"
        print(f"Sending chat request to: {chat_url}")
        
        response = session.post(chat_url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        
        result = response.json()
        print(f"Chat response received. Chunks used: {result.get('chunks_used', 0)}")
        
        return jsonify(result)
        
    except requests.exceptions.RequestException as e:
        print(f"Chat request failed: {e}")
        return jsonify({'error': f'Chat request failed: {str(e)}'}), 500
    except Exception as e:
        print(f"Chat error: {e}")
        return jsonify({'error': str(e)}), 500

@main.route('/health')
def health():
    """Health check endpoint with configuration info"""
    return jsonify({
        'status': 'healthy',
        'service': 'Legal Document Processing Service',
        'hf_base_url': HF_BASE_URL,
        'endpoints_configured': {
            'analysis': f"{HF_BASE_URL}/analyze_document",
            'chat': f"{HF_BASE_URL}/chat"
        },
        'cache_info': {
            'cached_documents': len(DOC_CACHE),
            'doc_ids': list(DOC_CACHE.keys())
        }
    })

@main.route('/cache_clear', methods=['POST'])
def clear_cache():
    """Clear the document cache"""
    cleared_count = len(DOC_CACHE)
    DOC_CACHE.clear()
    return jsonify({
        'message': f'Cleared {cleared_count} cached documents',
        'status': 'success'
    })

if __name__ == "__main__":

    main.run(debug=True, host='0.0.0.0', port=5000)
