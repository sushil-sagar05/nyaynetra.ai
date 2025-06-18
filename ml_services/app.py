from flask import Flask, request, jsonify
import os
import tempfile
import requests
from extraction.pdf_reader import load_pdf
from extraction.text_preprocessor import text_preprocessing
from summarization.chunker import chunk_by_token_limit
from summarization.summarization import summarize
from risk_detection.risk_detector import risk_detector_by_keyword_matcher
import dotenv
from clause_tagging.embedder import get_tagged_clauses_from_space,load_clause_reference
dotenv.load_dotenv()
HF_TOKEN = os.getenv('huggingface_token')
app = Flask(__name__)
@app.route('/summarize', methods=['POST'])
def summarizer():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
            pdf = load_pdf(temp_path)
            full_text = text_preprocessing(pdf)
            chunks = chunk_by_token_limit(full_text, 1024)
            result = summarize(chunks)
        os.remove(temp_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify(result)
@app.route('/risk_detection', methods=['POST'])
def risk_analysis():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
            pdf = load_pdf(temp_path)
            full_text = text_preprocessing(pdf)
            chunks = chunk_by_token_limit(full_text, 1024)
            risk_terms = risk_detector_by_keyword_matcher(chunks)
        os.remove(temp_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    if risk_terms:
        return jsonify({
            "status": "Risk Detected",
            "risk_score": len(risk_terms),
            "risk_terms": risk_terms
        }), 200
    else:
        return jsonify({"status": "No Risk"}), 200
@app.route('/key_clause', methods=['POST'])
def clause_match():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name
            pdf = load_pdf(temp_path)
            full_text = text_preprocessing(pdf)
            chunks = chunk_by_token_limit(full_text, 1024)
            clause_reference = load_clause_reference("clause_refrence.csv")
            key_clause = get_tagged_clauses_from_space(chunks,clause_reference)
        os.remove(temp_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'key_clauses': key_clause}), 200
@app.route('/analysis', methods=['POST'])
def analyze():
    data = request.get_json()
    document_url = data.get("documentUrl")
    print(document_url)
    if not document_url:
        return jsonify({'error': 'No document URL provided'}), 400

    try:
        response = requests.get(document_url)
        print(response)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download the document'}), 400
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(response.content)
            temp_path = temp_file.name

        pdf = load_pdf(temp_path)
        os.remove(temp_path)

        full_text = text_preprocessing(pdf)
        chunks = chunk_by_token_limit(full_text, 1024)
        summary = summarize(chunks)
        risk_terms = risk_detector_by_keyword_matcher(chunks)
        clause_reference = load_clause_reference("clause_refrence.csv")
        key_clause = get_tagged_clauses_from_space(chunks,clause_reference)

        return jsonify({
            'summary': summary,
            'risky_terms': risk_terms,
            'key_clauses': key_clause
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
if __name__ == "__main__":
    app.run(debug=True)
