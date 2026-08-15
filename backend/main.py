import os
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(
    title="Magic UI API",
    description="FastAPI Backend for Semantic Web Redesign using Gemini",
    version="0.1.0",
)

# Enable CORS for the Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini Client
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)


# Pydantic Schemas for Structured JSON Output
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Magic UI API! Visit /docs for the API explorer."}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "magic-ui-backend"}


@app.post("/api/redesign", response_model=RedesignResponse)
async def redesign_article(payload: ArticleRequest):
    if not api_key:
        raise HTTPException(
            status_code=500, detail="GEMINI_API_KEY is not configured in .env"
        )

    system_prompt = (
        "You are an expert semantic UI/UX designer. Transform the given cluttered webpage article "
        "into a structured, modern, distraction-free reading experience. Remove all ads, "
        "navbars, cookie warnings, and irrelevant promotional content."
    )

    user_prompt = f"Title: {payload.title}\nURL: {payload.url}\n\nContent:\n{payload.raw_text[:12000]}"

    try:
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=user_prompt,
            config={
                "system_instruction": system_prompt,
                "response_mime_type": "application/json",
                "response_schema": RedesignResponse,
            },
        )
        return RedesignResponse.model_validate_json(response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))