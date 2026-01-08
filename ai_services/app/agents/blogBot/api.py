import os
import uvicorn
import numpy as np
import traceback  # AJOUT
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional

# Core logic imports
from main import generate_blog

app = FastAPI(
    title="CoZetik BlogBot API",
    description="API de génération d'articles assistée par IA avec Expertise Report ADN CoZetik",
    version="1.1.0"
)

class BlogRequest(BaseModel):
    subject: str

class ExpertiseScores(BaseModel):
    adn_cozetik: float
    expertise_tech: float
    wording_humain: float
    structure_seo: float
    cta_impact: float

class BlogResponse(BaseModel):
    subject: str
    markdown: str
    expertise_report: ExpertiseScores
    sources: List[str]

@app.post("/api/v1/generate", response_model=BlogResponse)
async def api_generate_blog(request: BlogRequest):
    """
    Génère un article de blog complet + Rapport d'Expertise (Métriques NLP).
    """
    try:
        print(f"📝 Génération demandée pour: {request.subject}")
        
        # 1. Appel de la logique métier (Main)
        article_markdown, metadata = generate_blog(request.subject, with_metadata=True)
        
        scores = metadata.get('scores', {})
        
        return BlogResponse(
            subject=request.subject,
            markdown=article_markdown,
            expertise_report=ExpertiseScores(
                adn_cozetik=scores.get('coherence_adn', 0.0),
                expertise_tech=scores.get('expert_tech', 0.0),
                wording_humain=scores.get('wording_humain', 0.0),
                structure_seo=scores.get('structure_seo', 0.0),
                cta_impact=scores.get('cta_impact', 0.0)
            ),
            sources=metadata.get('sources', [])
        )
        
    except Exception as e:
        print(f"❌ ERREUR DÉTAILLÉE:")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
