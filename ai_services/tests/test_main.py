from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_quiz_recommander_happy_path():
    """
    Test nominal: on envoie des réponses valides, on attend un 200 OK 
    et une structure JSON conforme au schéma RecommendationOutput.
    Note: Ce test appelle réellement l'IA (test d'intégration).
    Pour des tests unitaires purs, il faudrait mocker get_quiz_chain.
    """
    payload = {
        "answers": {
            "q1": "B. Retrouver du temps, de l’organisation et du calme",
            "q2": "B. Le manque de temps / d’organisation",
            "q3": "B. Être organisé(e), efficace et léger(e)",
            "q10": "B. M’améliorer au travail"
        }
    }
    
    response = client.post("/api/recommander", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    
    # Vérification des champs obligatoires
    assert "profil_analysis" in data
    assert "principal_program" in data
    assert "name" in data["principal_program"]
    assert "reason" in data["principal_program"]
    assert "complementary_modules" in data
    assert "motivation_message" in data
    
    # Vérification logique simple (Profil B -> IA & Productivité)
    # On vérifie si l'IA a bien identifié le thème, sans être trop strict sur le texte exact
    prog_name = data["principal_program"]["name"].lower()
    assert "ia" in prog_name or "productivité" in prog_name

def test_quiz_recommander_empty_payload():
    """
    Test erreur: envoi d'un payload vide ou incomplet invalide.
    """
    response = client.post("/api/recommander", json={})
    # FastAPI doit renvoyer 422 Unprocessable Entity
    assert response.status_code == 422


