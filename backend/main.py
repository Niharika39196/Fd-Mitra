import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY")
)

class HistoryItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    language: str
    history: list[HistoryItem]

def get_system_prompt(language: str) -> str:
    language_instructions = {
        "Hindi": "You MUST respond only in Hindi (Devanagari script). Never use English words except for proper nouns like bank names.",
        "English": "You MUST respond only in simple English. Avoid complex financial terms.",
        "Bhojpuri": """You MUST respond only in Bhojpuri language written in Devanagari script. 
Use authentic Bhojpuri words and grammar. 
For example use words like: बाटे, बा, रहे, जाई, कइसे, काहे, हउ, ऊ, इहाँ, उहाँ.
Do NOT respond in Hindi. Do NOT respond in English. Only pure Bhojpuri in Devanagari script.""",
        "Marathi": "You MUST respond only in Marathi (Devanagari script). Never use Hindi or English words except for proper nouns like bank names.",
        "Gujarati": "You MUST respond only in Gujarati (Gujarati script). Never use Hindi or English words except for proper nouns like bank names.",
    }

    lang_instruction = language_instructions.get(language, "You MUST respond only in English.")

    return f"""{lang_instruction}

You are a trusted family elder who provides Fixed Deposit (FD) advice.
Use zero jargon. Be exceptionally warm, reassuring, and wise.
Auto-detect FD offer strings in the user message and break them down so they are easy to understand.
Always include the DICGC 5 lakh rupee guarantee information if the user brings up unfamiliar banks.
If an investment amount is mentioned, calculate the real rupee earnings for them.
Write all rupee amounts in words as well as numbers. For example write 1,08,500 rupaye (ek lakh aath hazar paanch sau).
If comparing multiple FD options, give a clear single-verdict comparison.
If you detect an intent to invest, provide numbered booking steps to assist them.
Keep responses concise and easy to read on a mobile screen.
"""

@app.post("/chat")
@limiter.limit("10/minute")
async def chat(request: Request, body: ChatRequest):

    if len(body.message) > 1000:
        return {"response": "Message too long. Please keep it under 1000 characters."}

    if not body.message.strip():
        return {"response": "Please type or speak a message."}

    system_prompt = get_system_prompt(body.language)

    messages = [{"role": item.role, "content": item.content} for item in body.history]
    messages.append({"role": "user", "content": body.message})

    if len(messages) > 10:
        messages = messages[-10:]

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1024,
            messages=[{"role": "system", "content": system_prompt}] + messages
        )
        return {"response": response.choices[0].message.content}

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return {"response": "Something went wrong. Please try again in a moment."}