import os
from langchain_anthropic import ChatAnthropic
from app.agents.quiz.schemas import RecommendationOutput  # On importe le schéma


def get_quiz_chain():
    target_path = os.path.join(os.path.dirname(__file__), "context.txt")

    # Check if context.txt exists at the target path
    if os.path.exists(target_path):
        system_context_path = target_path
    else:
        # Fallback to current directory if not found
        system_context_path = "./context.txt"

    model = ChatAnthropic(
        model="claude-haiku-4-5-20251001",
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        temperature=0,
        max_tokens=2048,
    )

    chain = model.with_structured_output(RecommendationOutput)

    return chain, system_context_path
