import requests
from requests.adapters import HTTPAdapter
from urllib3.util.ssl_ import create_urllib3_context

class SSLAdapter(HTTPAdapter):
    def init_poolmanager(self, *args, **kwargs):
        context = create_urllib3_context()
        context.check_hostname = False
        context.verify_mode = 0
        kwargs['ssl_context'] = context
        return super().init_poolmanager(*args, **kwargs)

# Monkeypatch requests.Session.send
old_send = requests.Session.send
def unsafe_send(self, request, **kwargs):
    kwargs['verify'] = False
    return old_send(self, request, **kwargs)
requests.Session.send = unsafe_send

from google import genai
from config import settings

try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    res = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Say hello in 5 words."
    )
    print("SUCCESS! Output:\n", res.text)
except Exception as e:
    print("FAILED:", e)
