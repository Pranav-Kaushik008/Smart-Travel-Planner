import httpx
from google import genai
from config import settings

print("Testing httpx with ssl verify=False...")
try:
    http_client = httpx.Client(verify=False)
    client = genai.Client(api_key=settings.GEMINI_API_KEY, http_options={'httpx_client': http_client})
    res = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello in 5 words."
    )
    print("SUCCESS! Output:", res.text)
except Exception as e:
    print("FAILED with http_client:", e)
