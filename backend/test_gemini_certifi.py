import os
import ssl

# Set env vars for httpx / requests to bypass local Windows SSL cert issue
os.environ["PYTHONHTTPSVERIFY"] = "0"
os.environ["CURL_CA_BUNDLE"] = ""
os.environ["SSL_CERT_FILE"] = ""

try:
    import certifi
    os.environ["SSL_CERT_FILE"] = certifi.where()
    print("Set SSL_CERT_FILE to certifi:", certifi.where())
except ImportError:
    pass

from google import genai
from config import settings

try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    res = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello in 5 words."
    )
    print("SUCCESS! Output:", res.text)
except Exception as e:
    print("FAILED:", e)
