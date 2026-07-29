import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
import requests

old_send = requests.Session.send
def unsafe_send(self, request, **kwargs):
    kwargs['verify'] = False
    return old_send(self, request, **kwargs)
requests.Session.send = unsafe_send

from google import genai
from config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)
for m in ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"]:
    try:
        res = client.models.generate_content(model=m, contents="Say hello in 5 words.")
        print(f"SUCCESS with {m}:\n", res.text)
        break
    except Exception as e:
        print(f"FAILED with {m}:", e)
