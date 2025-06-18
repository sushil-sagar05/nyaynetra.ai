import os
import requests
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv('huggingface_token')

SPACE_SUMMARIZATION_URL = "https://sagar008-nyaynetra-summarizer.hf.space/summarize"

def call_space_summarizer(text):
    headers = {
        "Authorization": f"Bearer {HF_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {"text": text}
    response = requests.post(SPACE_SUMMARIZATION_URL, headers=headers, json=payload)

    try:
        response_json = response.json()
    except Exception:
        return None

    if response.status_code == 200:
        return response_json.get("summary_combined", "")
    else:
        return None

def summarize(chunks):
    if not chunks:
        raise ValueError("No valid text chunks were created. Please check the PDF content.")

    summaries = []
    for chunk in chunks:
        if chunk.strip():
            result = call_space_summarizer(chunk)
            if result:
                summaries.append(result)

    super_summary = " ".join(summaries)
    short_summary = call_space_summarizer(super_summary)

    return {
        "actual_summary": super_summary,
        "short_summary": short_summary,
    }
