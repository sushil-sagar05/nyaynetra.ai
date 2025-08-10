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
HF_ANALYZE_URL = os.getenv('HF_ANALYZE_URL')

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

def call_unified_analysis(full_text, timeout=300):
    """Send text to HF Space for complete analysis"""
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {"document_text": full_text}
    
    try:
        response = session.post(HF_ANALYZE_URL, headers=headers, json=payload, timeout=timeout)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f" HF Space request failed: {e}")
        raise Exception(f"Analysis failed: {str(e)}")

@main.route('/analysis', methods=['POST'])
def analyze():
    """Single route that handles both file upload and URL download"""
    if 'file' in request.files and request.files['file'].filename != '':
        file = request.files['file']
        file_bytes = file.read()
        print(f" Processing uploaded file: {file.filename}")
    elif request.is_json:
        data = request.get_json()
        document_url = data.get("documentUrl")
        if not document_url:
            return jsonify({'error': 'No file or document URL provided'}), 400
        
        print(f" Downloading document from: {document_url}")
        response = requests.get(document_url, timeout=60)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download the document'}), 400
        file_bytes = response.content
    
    else:
        return jsonify({'error': 'No file or document URL provided'}), 400
    doc_id = compute_doc_id(file_bytes)
    
    if doc_id in DOC_CACHE:
        print(f" Using cached analysis for doc_id: {doc_id}")
        return jsonify(DOC_CACHE[doc_id]), 200

    try:
        print(f" Processing new document")
        full_text = extract_text_from_file(file_bytes)
        print(f" Extracted text length: {len(full_text)} characters")
        result = call_unified_analysis(full_text)
        DOC_CACHE[doc_id] = result
        
        return jsonify(result), 200

    except Exception as e:
        print(f" Error in analysis: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    main.run(debug=True)
