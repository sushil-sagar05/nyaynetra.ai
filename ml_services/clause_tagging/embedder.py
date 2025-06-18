import csv
import os
import requests

def load_clause_reference(csv_file_name):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_file_path = os.path.join(current_dir, csv_file_name)

    clause_reference = []
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            clause_reference.append({
                "label": row["Label"].strip(),
                "text": row["Text"].strip()
            })
    return clause_reference

def get_tagged_clauses_from_space(chunks, clause_reference):
    HF_SPACE_URL = "https://sagar008-nyaynetra-embedder-tagger.hf.space/tag_clauses"

    payload = {
        "chunks": chunks,
        "clause_reference": clause_reference
    }

    try:
        res = requests.post(HF_SPACE_URL, json=payload, timeout=60)
        res.raise_for_status()
        return res.json()
    except Exception as e:
        print(f"[HF Space Error]: {e}")
        return []