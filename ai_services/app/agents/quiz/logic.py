import os
from langchain_mistralai import ChatMistralAI
from app.agents.quiz.schemas import RecommendationOutput # On importe le schéma

def get_quiz_chain():
    target_path = os.path.join(os.path.dirname(__file__), "context.txt")
    
    # Check if context.txt exists at the target path
    if os.path.exists(target_path):
        system_context_path = target_path
    else:
        # Fallback to current directory if not found
        system_context_path = "./context.txt"

    model = ChatMistralAI(
        model = "labs-mistral-small-creative",
        api_key=os.getenv("MISTRAL_API_KEY"),
        temperature=0
    )

    chain = model.with_structured_output(RecommendationOutput)

    return chain, system_context_path
