from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.agents.quiz.logic import get_quiz_chain

from app.agents.quiz.schemas import QuizInput, RecommendationOutput


load_dotenv()


app = FastAPI(title="Cozetik AI Recommender")

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
