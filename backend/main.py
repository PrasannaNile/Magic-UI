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

# Enable CORS for the Chrome Extension# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

app = FastAPI(title="Magic UI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class ContentBlock(BaseModel):
    block_type: str = Field(..., description="'heading', 'paragraph', 'code', 'quote', or 'key_takeaway'")
    text: str
    level: Optional[int] = Field(None, description="1-3 if block_type is heading")

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

@app.post("/api/redesign", response_model=RedesignResponse)
async def redesign_article(payload: ArticleRequest):
    prompt = (
        f"Title: {payload.title}\n"
        f"URL: {payload.url}\n\n"
        f"Raw Article Content:\n{payload.raw_text[:12000]}"
    )
    
    system_instruction = (
        "You are an expert semantic web designer. Clean, declutter, and structure the given article. "
        "Remove all ads, sponsored content, and cookie text. Return purely valid JSON matching the schema."
    )

    try:
        interaction = client.interactions.create(
            model="gemini-2.5-flash",
            input=prompt,
            system_instruction=system_instruction,
            response_schema=RedesignResponse,
        )
        return RedesignResponse.model_validate_json(interaction.outputs[-1].text)
    except Exception as e:
        # Fallback to standard generate_content if using older SDK build
        try:
            response = client.models.generate_content(
                model="gemini-3.7-flash",
                contents=prompt,
                config={
                    "system_instruction": system_instruction,
                    "response_mime_type": "application/json",
                    "response_schema": RedesignResponse,
                }
            )
            return RedesignResponse.model_validate_json(response.text)
        except Exception as inner_e:
            raise HTTPException(status_code=500, detail=str(inner_e))
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
            model="gemini-3.6-flash",
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