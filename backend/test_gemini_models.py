import asyncio
from config import settings
from google import genai

print("API Key Present:", bool(settings.GEMINI_API_KEY))

if settings.GEMINI_API_KEY:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    try:
        res = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Say hello in 5 words."
        )
        print("Success with gemini-2.0-flash:", res.text)
    except Exception as e:
        print("Error with gemini-2.0-flash:", e)

    try:
        res2 = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Say hello in 5 words."
        )
        print("Success with gemini-2.5-flash:", res2.text)
    except Exception as e:
        print("Error with gemini-2.5-flash:", e)
