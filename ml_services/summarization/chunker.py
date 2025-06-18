import requests

HF_SPACE_CHUNK_URL = "https://sagar008-nyaynetra-summarizer.hf.space/chunk"  

def chunk_by_token_limit(text, max_tokens):
    payload = {
        "text": text,
        "max_tokens": max_tokens
    }
    response = requests.post(HF_SPACE_CHUNK_URL, json=payload)
    if response.status_code == 200:
        data = response.json()
        return data.get("chunks", [])
    else:
        raise Exception(f"Chunk API failed with status {response.status_code}: {response.text}")