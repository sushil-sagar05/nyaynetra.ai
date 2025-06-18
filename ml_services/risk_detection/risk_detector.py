
import csv
from collections import defaultdict
import os

def load_risk_terms(csv_file_path):
    risk_terms_dict = defaultdict(list)
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            category = row["Category"].strip()
            term = row["Risky Term"].strip()
            risk_terms_dict[category].append(term)
    return risk_terms_dict


def risk_detector_by_keyword_matcher(chunks):
    if not chunks:
        raise ValueError("No valid text chunks were created. Please check the PDF content.")
    current_dir = os.path.dirname(__file__)
    csv_path = os.path.join(current_dir, 'risky_terms.csv')
    risk_terms_dict = load_risk_terms(csv_path)
    risk_terms = []
    for chunk in chunks:
        chunk_lower = chunk.lower()
        matched_terms = []
        for category, terms in risk_terms_dict.items():
            for term in terms:
                if term.lower() in chunk_lower:
                    matched_terms.append({"category": category, "term": term})
        if matched_terms:
            risk_terms.append({
                "risks": matched_terms 
            })
    return risk_terms
