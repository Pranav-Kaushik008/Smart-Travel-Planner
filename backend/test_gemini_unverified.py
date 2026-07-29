import ssl
ssl._create_default_https_context = ssl._create_unverified_context

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
