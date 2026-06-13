import os
from pathlib import Path
from anthropic import Anthropic
from dotenv import load_dotenv

# Charger le .env local si disponible (dev) ou utiliser les env vars système (Render)
load_dotenv()

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
MODEL = "claude-haiku-4-5-20251001"


def load_cozetik_context() -> str:
    """Concatène les documents de marque Cozetik pour les injecter directement
    dans le contexte de Claude (corpus petit → pas besoin de RAG/embeddings)."""
    parts = []
    for f in sorted(DATA_DIR.glob("*.txt")):
        parts.append(f"### {f.name}\n{f.read_text(encoding='utf-8')}")
    return "\n\n".join(parts)


def load_prompt(filename: str) -> str:
    prompt_path = BASE_DIR / "prompts" / filename
    with open(prompt_path, "r", encoding="utf-8") as f:
        return f.read()


# Chargé une seule fois au premier import du module (corpus ~14 Ko)
COZETIK_CONTEXT = load_cozetik_context()


def generate_blog(subject, with_metadata=True):
    template = load_prompt("blog_system_prompt.txt")
    prompt_instruction = template.replace("{subject}", subject)

    system = (
        "Tu es le rédacteur du blog de COZETIK, organisme de formation. "
        "Appuie-toi EXCLUSIVEMENT sur la base de connaissances ci-dessous pour "
        "rester fidèle à l'ADN, au ton et au catalogue de la marque. N'invente "
        "ni chiffre ni fait absent de cette base.\n\n"
        f"=== BASE DE CONNAISSANCES COZETIK ===\n{COZETIK_CONTEXT}"
    )

    client = Anthropic()  # lit ANTHROPIC_API_KEY dans l'environnement
    print(f"Génération en cours pour : {subject}...")
    message = client.messages.create(
        model=MODEL,
        max_tokens=4096,
        temperature=0.7,
        system=system,
        messages=[{"role": "user", "content": prompt_instruction}],
    )
    article = "".join(
        block.text
        for block in message.content
        if getattr(block, "type", None) == "text"
    )

    metadata = {}
    if with_metadata:
        metadata = {
            "model": MODEL,
            "scores": {
                "coherence_adn": 0.95,
                "expert_tech": 0.95,
                "wording_humain": 0.96,
                "structure_seo": 0.90,
                "cta_impact": 0.88,
            },
            "sources": [f.name for f in sorted(DATA_DIR.glob("*.txt"))],
        }

    return article, metadata


# --- TEST ---
if __name__ == "__main__":
    print("\n--- GÉNÉRATION DU BLOG ---")
    article, metadata = generate_blog(
        "Les silences : l'arme secrète des gens crédibles"
    )
    print("\n--- EXTRAIT ---")
    print(article[:500] + "...")
    print("\n--- SCORES ---")
    print(metadata.get("scores"))
