# evaluation/test_cases.py
"""
Jeu de données de test avec les sorties attendues.
Chaque cas de test contient:
- answers: Les réponses simulées au quiz
- expected_program: Le programme signature attendu
- expected_keywords: Mots-clés importants attendus dans l'analyse
"""

TEST_CASES = [
    {
        "name": "Profil B - Productivité Pure",
        "answers": {
            "q1": "B. Je manque de temps, je suis noyé(e) sous les tâches",
            "q2": "B. Penses à tout ce que tu dois faire après, ça te parasite",
            "q3": "B. Être organisé(e), léger(ère), moins chargé(e)",
            "q4": "B. « J'ai trop de choses en tête, je n'arrête jamais. »",
            "q5": "B. Je suis dispersé(e), je papillonne, je m'épuise",
            "q6": "B. Des outils qui simplifient ta vie et te font gagner du temps",
            "q7": "B. Retrouver de l'air dans ma tête",
            "q8": "B. Le manque de temps et la surcharge",
            "q9": "B. Je suis efficace, organisé(e), je gère sans subir",
            "q10": "B. Efficacité / structure"
        },
        "expected_program": "IA & Productivité",
        "expected_keywords": ["productivité", "temps", "organisation", "efficacité", "automatisation", "IA"]
    },
    {
        "name": "Profil A - Communication",
        "answers": {
            "q1": "A. Je sais des choses, mais je n'arrive pas à les dire comme je veux",
            "q2": "A. Perds tes mots ou tu parles trop vite",
            "q3": "A. Être clair(e), crédible, écouté(e)",
            "q4": "A. « J'ai une bonne tête, mais je n'imprime pas toujours. »",
            "q5": "A. Le regard des autres me bloque",
            "q6": "A. Des exercices concrets avec feedback sur ta manière de parler",
            "q7": "A. Qu'on m'écoute vraiment et qu'on me respecte",
            "q8": "A. La peur de parler / d'être jugé(e)",
            "q9": "A. Je m'exprime avec aisance, je suis respecté(e)",
            "q10": "A. Impact / expression"
        },
        "expected_program": "Prise de Parole",
        "expected_keywords": ["parole", "communication", "confiance", "expression", "charisme", "oral"]
    },
    {
        "name": "Profil C - Intelligence Émotionnelle",
        "answers": {
            "q1": "C. Je gère en apparence, mais intérieurement je suis souvent tendu(e)",
            "q2": "C. Sens le stress monter et ça te fatigue avant même d'y être",
            "q3": "C. Être calme, stable, apaisé(e)",
            "q4": "C. « Je prends sur moi… mais ça me coûte. »",
            "q5": "C. Je rumine / je m'inquiète / je me mets la pression",
            "q6": "C. Des méthodes pour retrouver un équilibre intérieur",
            "q7": "C. Être solide émotionnellement, même quand c'est dur",
            "q8": "C. Le stress et la pression interne",
            "q9": "C. Je suis stable, serein(e), plus en paix",
            "q10": "C. Profondeur / sensibilité"
        },
        "expected_program": "Intelligence Émotionnelle",
        "expected_keywords": ["émotion", "stress", "calme", "stabilité", "équilibre", "sérénité"]
    },
    {
        "name": "Profil H - Kizomba Bien-être",
        "answers": {
            "q1": "H. Je manque d'aisance dans mon corps / présence / social",
            "q2": "H. Te sens pas totalement à l'aise physiquement, ça se voit",
            "q3": "H. Être plus à l'aise socialement et dans ton corps",
            "q4": "H. « Je suis à l'aise par moments, mais pas \"stablement\". »",
            "q5": "H. Je me sens souvent tendu(e) ou pas aligné(e) physiquement",
            "q6": "H. Une expérience corporelle, pratique, qui te transforme",
            "q7": "H. Me sentir bien dans mon corps et dans ma présence",
            "q8": "H. La tension dans ton corps et l'inconfort social",
            "q9": "H. Je suis confiant(e), présent(e), à l'aise socialement",
            "q10": "H. Présence / énergie"
        },
        "expected_program": "Kizomba",
        "expected_keywords": ["corps", "présence", "bien-être", "confiance", "social", "connexion"]
    },
    {
        "name": "Profil Mixte A+E (Carrière + Communication)",
        "answers": {
            "q1": "A. Je sais des choses, mais je n'arrive pas à les dire comme je veux",
            "q2": "E. Sais que tu pourrais briller mais tu ne sais pas \"te positionner\"",
            "q3": "E. Être plus visible, mieux valorisé(e), plus \"choisi(e)\"",
            "q4": "A. « J'ai une bonne tête, mais je n'imprime pas toujours. »",
            "q5": "E. Je n'ai pas une stratégie claire pour avancer pro",
            "q6": "A. Des exercices concrets avec feedback sur ta manière de parler",
            "q7": "E. Avoir une carrière qui me ressemble, pas juste un job",
            "q8": "A. La peur de parler / d'être jugé(e)",
            "q9": "E. J'ai franchi un cap carrière / salaire / opportunité",
            "q10": "A. Impact / expression"
        },
        "expected_program": "Prise de Parole",
        "expected_keywords": ["parole", "carrière", "visibilité", "confiance", "entretien"]
    }
]
