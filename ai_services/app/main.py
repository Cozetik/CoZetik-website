from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

from app.agents.quiz.logic import get_quiz_chain
from app.agents.quiz.schemas import QuizInput, RecommendationOutput


load_dotenv()

# Schemas pour le Blog
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


app = FastAPI(title="Cozetik AI Services - Quiz & Blog")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/recommander", response_model=RecommendationOutput)
async def generate_recommendation(data: QuizInput):

    chain, context_path = get_quiz_chain()

    # Read context file content
    try:
        with open(context_path, "r") as f:
            system_prompt = f.read()
    except FileNotFoundError:
        system_prompt = ""

    answers_text = "\n".join([f"{key}:{value}" for key, value in data.answers.items()])

    final_prompt = f"{system_prompt}\n\nVoici Les Reponses du candidat:\n{answers_text}"

    try:
        res = chain.invoke(final_prompt)

        return res 
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/blog/generate", response_model=BlogResponse)
async def generate_blog_post(request: BlogRequest):
    """
    Génère un article de blog complet avec rapport d'expertise.
    """
    try:
        # Import lazy pour éviter de charger le module si non utilisé
        import sys
        import os
        
        # Ajouter le chemin vers blogBot
        blogbot_path = os.path.join(os.path.dirname(__file__), "agents", "blogBot")
        if blogbot_path not in sys.path:
            sys.path.insert(0, blogbot_path)
        
        from main import generate_blog
        
        print(f"📝 Génération demandée pour: {request.subject}")
        
        # Génération de l'article
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
        print(f"❌ Erreur lors de la génération du blog: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Erreur de génération: {str(e)}")
