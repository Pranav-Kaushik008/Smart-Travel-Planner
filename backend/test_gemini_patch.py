import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Patch urllib3 create_urllib3_context
import ssl
old_create_context = ssl.create_default_context
def unverified_context(*args, **kwargs):
    ctx = old_create_context(*args, **kwargs)
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx
ssl.create_default_context = unverified_context

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
