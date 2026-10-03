import os
import requests
from dotenv import load_dotenv

load_dotenv()

key = os.getenv("GEMINI_API_KEY")
url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent"

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": key,
}

data = {
    "contents": [{"parts": [{"text": "Hello, answer in 3 words."}]}]
}

response = requests.post(url, headers=headers, json=data)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text}")