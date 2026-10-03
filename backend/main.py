import os
from pathlib import Path
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Explicitly load .env from the current file's directory
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("⚠️ WARNING: GEMINI_API_KEY was not found in backend/.env!")
else:
    print(f"🔑 Loaded GEMINI_API_KEY: {api_key[:6]}...{api_key[-4:]}")

# Initialize standard v1beta client
client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(api_version="v1beta")
)

app = FastAPI(
    title="Magic UI API",
    description="FastAPI Backend for Semantic Web Redesign using Gemini",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ContentBlock(BaseModel):
    block_type: str = Field(
        ...,
        description="Type: 'heading', 'paragraph', 'code', 'quote', or 'key_takeaway'",
    )
    text: str
    level: Optional[int] = Field(
        None, description="Heading level 1-3 if block_type is heading"
    )


class RedesignResponse(BaseModel):
    title: str
    byline: Optional[str] = None
    estimated_read_time: int
    tldr: str
    key_points: List[str]
    sections: List[ContentBlock]


class ArticleRequest(BaseModel):
    url: str
    title: str
    raw_text: str


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "magic-ui-backend"}


@app.post("/api/redesign", response_model=RedesignResponse)
async def redesign_article(payload: ArticleRequest):
    if not api_key:
        raise HTTPException(
            status_code=500, detail="GEMINI_API_KEY is not configured in backend/.env"
        )

    clean_text = payload.raw_text.strip() if payload.raw_text else ""
    if len(clean_text) < 20:
        raise HTTPException(
            status_code=400, detail="Insufficient text content to redesign."
        )

    system_prompt = (
        "You are an expert semantic UI/UX designer. Transform the given cluttered webpage article "
        "into a structured, modern, distraction-free reading experience. Remove all ads, "
        "navbars, cookie warnings, and irrelevant promotional content."
    )

    user_prompt = (
        f"Title: {payload.title}\n"
        f"URL: {payload.url}\n\n"
        f"Content:\n{clean_text[:8000]}"
    )

    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=RedesignResponse,
            ),
        )
        return RedesignResponse.model_validate_json(response.text)
    except Exception as e:
        print(f"Gemini API Error: {repr(e)}")
        raise HTTPException(status_code=500, detail=str(e))