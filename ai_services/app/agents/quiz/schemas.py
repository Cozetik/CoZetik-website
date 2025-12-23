from pydantic import BaseModel, Field
from typing import List, Dict

class QuizInput(BaseModel):
    answers: Dict[str, str]

class FormationDetails(BaseModel):
    name : str = Field(description="Le nom exacte de la formation recommandée issue du catalogue")
    reason: str = Field(description="Une phrase expliquant pourquoi cette formation match avec le profil")

class RecommendationOutput(BaseModel):
    profil_analysis: str = Field(description="Une synthèse psychologique du profil utilisateur basee sur ses reponses (ex: 'Profil ambitieux mais bloqué par le stress')")
    principal_program: FormationDetails = Field(description="La formation signature prioritaire (ex: Prise de Parole)")
    complementary_modules: List[FormationDetails] = Field(description="Liste de 1 ou 2 modules complémentaires pertinents")
    motivation_message: str = Field(description="Une phrase de fin inspirante et bienveillante")
        