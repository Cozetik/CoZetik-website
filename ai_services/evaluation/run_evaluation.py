#!/usr/bin/env python3
"""
evaluation/run_evaluation.py

Pipeline d'évaluation NLP pour mesurer la qualité des recommandations.
Utilise:
- Sentence-Transformers pour les embeddings
- Cosine Similarity pour comparer les sorties
- Matplotlib pour la visualisation
"""

import os
import sys
import json
import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Tuple

# Ajouter le path parent pour les imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import httpx
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

from evaluation.test_cases import TEST_CASES

# Configuration
API_URL = "http://127.0.0.1:8000/api/recommander"
EMBEDDING_MODEL = "paraphrase-multilingual-MiniLM-L12-v2"  # Modèle multilingue rapide


def call_api(answers: Dict[str, str]) -> Dict:
    """Appelle l'API de recommandation."""
    response = httpx.post(API_URL, json={"answers": answers}, timeout=60.0)
    response.raise_for_status()
    return response.json()


def calculate_program_match(actual: str, expected: str) -> float:
    """
    Vérifie si le programme recommandé correspond à l'attendu.
    Retourne 1.0 si match, 0.0 sinon.
    """
    actual_lower = actual.lower()
    expected_lower = expected.lower()
    
    # Match exact ou partiel
    if expected_lower in actual_lower or actual_lower in expected_lower:
        return 1.0
    return 0.0


def calculate_keyword_coverage(text: str, keywords: List[str]) -> float:
    """
    Calcule le pourcentage de mots-clés attendus présents dans le texte.
    """
    text_lower = text.lower()
    matches = sum(1 for kw in keywords if kw.lower() in text_lower)
    return matches / len(keywords) if keywords else 0.0


def calculate_semantic_similarity(
    model: SentenceTransformer,
    actual_text: str,
    expected_keywords: List[str]
) -> float:
    """
    Calcule la similarité cosinus entre le texte généré et les mots-clés attendus.
    """
    # Créer une phrase représentative avec les mots-clés
    expected_text = " ".join(expected_keywords)
    
    # Générer les embeddings
    embeddings = model.encode([actual_text, expected_text])
    
    # Calculer la similarité cosinus
    similarity = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
    
    return float(similarity)


def run_evaluation() -> List[Dict]:
    """
    Exécute l'évaluation complète sur tous les cas de test.
    """
    print("=" * 60)
    print("🔬 ÉVALUATION NLP DES RECOMMANDATIONS COZETIK")
    print("=" * 60)
    
    # Charger le modèle d'embeddings
    print("\n📦 Chargement du modèle d'embeddings...")
    model = SentenceTransformer(EMBEDDING_MODEL)
    print(f"   Modèle: {EMBEDDING_MODEL}")
    
    results = []
    
    for i, test_case in enumerate(TEST_CASES, 1):
        print(f"\n{'─' * 50}")
        print(f"📝 Test {i}/{len(TEST_CASES)}: {test_case['name']}")
        print(f"{'─' * 50}")
        
        try:
            # Appeler l'API
            print("   ⏳ Appel API...")
            response = call_api(test_case["answers"])
            
            # Extraire les données
            actual_program = response.get("principal_program", {}).get("name", "")
            actual_reason = response.get("principal_program", {}).get("reason", "")
            actual_analysis = response.get("profil_analysis", "")
            actual_motivation = response.get("motivation_message", "")
            
            # Texte complet pour l'analyse sémantique
            full_text = f"{actual_analysis} {actual_reason} {actual_motivation}"
            
            # Calculer les métriques
            program_match = calculate_program_match(actual_program, test_case["expected_program"])
            keyword_coverage = calculate_keyword_coverage(full_text, test_case["expected_keywords"])
            semantic_sim = calculate_semantic_similarity(model, full_text, test_case["expected_keywords"])
            
            # Score global (moyenne pondérée)
            global_score = (program_match * 0.5) + (keyword_coverage * 0.25) + (semantic_sim * 0.25)
            
            result = {
                "test_name": test_case["name"],
                "expected_program": test_case["expected_program"],
                "actual_program": actual_program,
                "program_match": program_match,
                "keyword_coverage": keyword_coverage,
                "semantic_similarity": semantic_sim,
                "global_score": global_score,
                "full_response": response
            }
            results.append(result)
            
            # Affichage
            match_emoji = "✅" if program_match == 1.0 else "❌"
            print(f"   Programme attendu: {test_case['expected_program']}")
            print(f"   Programme obtenu:  {actual_program} {match_emoji}")
            print(f"   📊 Programme Match:      {program_match:.0%}")
            print(f"   📊 Keyword Coverage:     {keyword_coverage:.0%}")
            print(f"   📊 Similarité Cosinus:   {semantic_sim:.2%}")
            print(f"   📊 SCORE GLOBAL:         {global_score:.2%}")
            
        except Exception as e:
            print(f"   ❌ Erreur: {str(e)}")
            results.append({
                "test_name": test_case["name"],
                "error": str(e),
                "global_score": 0.0
            })
    
    return results


def generate_visualizations(results: List[Dict]):
    """
    Génère les graphiques de visualisation.
    Crée 4 images séparées avec légendes et explications.
    """
    print("\n" + "=" * 60)
    print("📊 GÉNÉRATION DES VISUALISATIONS")
    print("=" * 60)
    
    # Filtrer les résultats sans erreur
    valid_results = [r for r in results if "error" not in r]
    
    if not valid_results:
        print("   ❌ Aucun résultat valide à visualiser.")
        return
    
    # Dossier de sortie
    output_dir = os.path.dirname(__file__)
    
    # Données pour les graphiques
    test_names = [r["test_name"].replace(" - ", "\n") for r in valid_results]
    short_names = [r["test_name"].split(" - ")[0] for r in valid_results]
    program_matches = [r["program_match"] for r in valid_results]
    keyword_coverages = [r["keyword_coverage"] for r in valid_results]
    semantic_sims = [r["semantic_similarity"] for r in valid_results]
    global_scores = [r["global_score"] for r in valid_results]
    
    # Couleurs cohérentes
    colors = plt.cm.viridis(np.linspace(0.2, 0.8, len(valid_results)))
    
    # ═══════════════════════════════════════════════════════════════
    # GRAPHIQUE 1: Score Global par Profil (Barres horizontales)
    # ═══════════════════════════════════════════════════════════════
    fig1, ax1 = plt.subplots(figsize=(12, 7))
    
    bars = ax1.barh(test_names, global_scores, color=colors, edgecolor="black", linewidth=0.5)
    ax1.set_xlim(0, 1.15)
    ax1.set_xlabel("Score Global (0 à 1)", fontsize=12)
    ax1.set_title("🎯 SCORE GLOBAL PAR PROFIL DE TEST", fontsize=14, fontweight="bold", pad=20)
    
    # Seuil acceptable
    ax1.axvline(x=0.8, color="green", linestyle="--", linewidth=2, alpha=0.8, label="Seuil acceptable (80%)")
    ax1.axvline(x=0.6, color="orange", linestyle="--", linewidth=1.5, alpha=0.6, label="Seuil minimum (60%)")
    
    # Valeurs sur les barres
    for bar, score in zip(bars, global_scores):
        color = "green" if score >= 0.8 else ("orange" if score >= 0.6 else "red")
        ax1.text(bar.get_width() + 0.02, bar.get_y() + bar.get_height()/2, 
                 f"{score:.0%}", va="center", fontsize=11, fontweight="bold", color=color)
    
    ax1.legend(loc="lower right", fontsize=10)
    
    # Explication
    explanation = """
    📌 INTERPRÉTATION:
    • Score Global = (Programme Match × 50%) + (Keyword Coverage × 25%) + (Similarité Cosinus × 25%)
    • ≥ 80%: EXCELLENT - Le modèle recommande correctement
    • 60-80%: BON - Performance acceptable
    • < 60%: À AMÉLIORER
    """
    fig1.text(0.02, 0.02, explanation, fontsize=9, verticalalignment="bottom", 
              bbox=dict(boxstyle="round", facecolor="lightyellow", alpha=0.8))
    
    plt.tight_layout()
    path1 = os.path.join(output_dir, "chart_1_score_global.png")
    plt.savefig(path1, dpi=150, bbox_inches="tight")
    print(f"   ✅ {path1}")
    plt.close()
    
    # ═══════════════════════════════════════════════════════════════
    # GRAPHIQUE 2: Détail des Métriques (Barres groupées)
    # ═══════════════════════════════════════════════════════════════
    fig2, ax2 = plt.subplots(figsize=(12, 7))
    
    x = np.arange(len(short_names))
    width = 0.25
    
    bars1 = ax2.bar(x - width, program_matches, width, label="Programme Match", color="#2ecc71", edgecolor="black")
    bars2 = ax2.bar(x, keyword_coverages, width, label="Keyword Coverage", color="#3498db", edgecolor="black")
    bars3 = ax2.bar(x + width, semantic_sims, width, label="Similarité Cosinus", color="#9b59b6", edgecolor="black")
    
    ax2.set_ylabel("Score (0 à 1)", fontsize=12)
    ax2.set_title("📊 DÉTAIL DES 3 MÉTRIQUES PAR PROFIL", fontsize=14, fontweight="bold", pad=20)
    ax2.set_xticks(x)
    ax2.set_xticklabels(short_names, rotation=30, ha="right", fontsize=10)
    ax2.legend(loc="upper right", fontsize=10)
    ax2.set_ylim(0, 1.2)
    ax2.axhline(y=1.0, color="gray", linestyle=":", alpha=0.5)
    
    # Grille
    ax2.yaxis.grid(True, linestyle="--", alpha=0.3)
    ax2.set_axisbelow(True)
    
    # Explication
    explanation = """
    📌 LES 3 MÉTRIQUES:
    • Programme Match (Vert): Le bon programme signature a-t-il été recommandé? (1 = OUI, 0 = NON)
    • Keyword Coverage (Bleu): % de mots-clés attendus présents dans la réponse (ex: "productivité", "temps"...)
    • Similarité Cosinus (Violet): Proximité sémantique entre la réponse et les attentes (embeddings NLP)
    """
    fig2.text(0.02, 0.02, explanation, fontsize=9, verticalalignment="bottom", 
              bbox=dict(boxstyle="round", facecolor="lightyellow", alpha=0.8))
    
    plt.tight_layout()
    path2 = os.path.join(output_dir, "chart_2_metriques_detail.png")
    plt.savefig(path2, dpi=150, bbox_inches="tight")
    print(f"   ✅ {path2}")
    plt.close()
    
    # ═══════════════════════════════════════════════════════════════
    # GRAPHIQUE 3: Radar Chart (Moyennes Globales)
    # ═══════════════════════════════════════════════════════════════
    fig3 = plt.figure(figsize=(10, 8))
    ax3 = fig3.add_subplot(111, projection="polar")
    
    categories = ["Programme\nMatch", "Keyword\nCoverage", "Similarité\nCosinus"]
    
    # Moyenne des scores
    avg_program = np.mean(program_matches)
    avg_keywords = np.mean(keyword_coverages)
    avg_semantic = np.mean(semantic_sims)
    
    values = [avg_program, avg_keywords, avg_semantic]
    values += values[:1]  # Fermer le polygone
    
    angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
    angles += angles[:1]
    
    ax3.set_theta_offset(np.pi / 2)
    ax3.set_theta_direction(-1)
    ax3.plot(angles, values, "o-", linewidth=3, color="#e74c3c", markersize=10)
    ax3.fill(angles, values, alpha=0.3, color="#e74c3c")
    ax3.set_xticks(angles[:-1])
    ax3.set_xticklabels(categories, fontsize=12)
    ax3.set_ylim(0, 1)
    ax3.set_title("🕸️ MOYENNES GLOBALES (RADAR CHART)", fontsize=14, fontweight="bold", pad=30)
    
    # Ajouter les valeurs
    for angle, value, cat in zip(angles[:-1], values[:-1], categories):
        ax3.annotate(f"{value:.0%}", xy=(angle, value), xytext=(angle, value + 0.12),
                     ha="center", fontsize=11, fontweight="bold", color="#e74c3c")
    
    # Explication
    explanation = f"""
    📌 INTERPRÉTATION DU RADAR:
    • Programme Match Moyen: {avg_program:.0%}
    • Keyword Coverage Moyen: {avg_keywords:.0%}  
    • Similarité Cosinus Moy.: {avg_semantic:.0%}
    
    ➡️ Plus le triangle est grand et équilibré, meilleure est la performance.
    """
    fig3.text(0.5, 0.02, explanation, fontsize=10, ha="center", 
              bbox=dict(boxstyle="round", facecolor="lightyellow", alpha=0.8))
    
    plt.tight_layout()
    path3 = os.path.join(output_dir, "chart_3_radar_moyennes.png")
    plt.savefig(path3, dpi=150, bbox_inches="tight")
    print(f"   ✅ {path3}")
    plt.close()
    
    # ═══════════════════════════════════════════════════════════════
    # GRAPHIQUE 4: Heatmap des Scores
    # ═══════════════════════════════════════════════════════════════
    fig4, ax4 = plt.subplots(figsize=(12, 6))
    
    data = np.array([program_matches, keyword_coverages, semantic_sims])
    im = ax4.imshow(data, cmap="RdYlGn", aspect="auto", vmin=0, vmax=1)
    
    ax4.set_yticks([0, 1, 2])
    ax4.set_yticklabels(["Programme Match", "Keyword Coverage", "Similarité Cosinus"], fontsize=11)
    ax4.set_xticks(range(len(short_names)))
    ax4.set_xticklabels(short_names, rotation=30, ha="right", fontsize=10)
    ax4.set_title("🌡️ HEATMAP DES SCORES PAR PROFIL ET MÉTRIQUE", fontsize=14, fontweight="bold", pad=20)
    
    # Colorbar
    cbar = plt.colorbar(im, ax=ax4, shrink=0.8)
    cbar.set_label("Score (0 = Rouge, 1 = Vert)", fontsize=10)
    
    # Valeurs dans les cellules
    for i in range(data.shape[0]):
        for j in range(data.shape[1]):
            text_color = "white" if data[i, j] < 0.5 else "black"
            ax4.text(j, i, f"{data[i, j]:.0%}", ha="center", va="center", 
                     color=text_color, fontsize=11, fontweight="bold")
    
    # Explication
    explanation = """
    📌 LECTURE DE LA HEATMAP:
    • Vert = Score élevé (proche de 100%)
    • Rouge = Score faible (proche de 0%)
    • Permet d'identifier rapidement les faiblesses par profil et par métrique
    """
    fig4.text(0.02, 0.02, explanation, fontsize=9, verticalalignment="bottom", 
              bbox=dict(boxstyle="round", facecolor="lightyellow", alpha=0.8))
    
    plt.tight_layout()
    path4 = os.path.join(output_dir, "chart_4_heatmap.png")
    plt.savefig(path4, dpi=150, bbox_inches="tight")
    print(f"   ✅ {path4}")
    plt.close()
    
    print(f"\n   📁 Tous les graphiques sont dans: {output_dir}/")


def print_summary(results: List[Dict]):
    """
    Affiche un résumé des résultats.
    """
    print("\n" + "=" * 60)
    print("📋 RÉSUMÉ DE L'ÉVALUATION")
    print("=" * 60)
    
    valid_results = [r for r in results if "error" not in r]
    
    if not valid_results:
        print("   ❌ Aucun test réussi.")
        return
    
    avg_global = np.mean([r["global_score"] for r in valid_results])
    avg_program = np.mean([r["program_match"] for r in valid_results])
    avg_keywords = np.mean([r["keyword_coverage"] for r in valid_results])
    avg_semantic = np.mean([r["semantic_similarity"] for r in valid_results])
    
    print(f"\n   📊 Score Global Moyen:       {avg_global:.1%}")
    print(f"   📊 Accuracy Programme:       {avg_program:.1%}")
    print(f"   📊 Keyword Coverage Moyen:   {avg_keywords:.1%}")
    print(f"   📊 Similarité Cosinus Moy.:  {avg_semantic:.1%}")
    
    # Verdict
    print("\n   " + "─" * 40)
    if avg_global >= 0.8:
        print("   🏆 VERDICT: EXCELLENT - Le modèle performe très bien!")
    elif avg_global >= 0.6:
        print("   ✅ VERDICT: BON - Performance acceptable.")
    elif avg_global >= 0.4:
        print("   ⚠️  VERDICT: MOYEN - Amélioration nécessaire.")
    else:
        print("   ❌ VERDICT: FAIBLE - Le modèle doit être revu.")
    print("   " + "─" * 40)


if __name__ == "__main__":
    print("\n🚀 Démarrage de l'évaluation...")
    print("   ⚠️  Assurez-vous que le serveur uvicorn est lancé!")
    print()
    
    # Lancer l'évaluation
    results = run_evaluation()
    
    # Afficher le résumé
    print_summary(results)
    
    # Générer les visualisations
    generate_visualizations(results)
    
    # Sauvegarder les résultats JSON
    output_json = os.path.join(os.path.dirname(__file__), "evaluation_results.json")
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n   ✅ Résultats JSON: {output_json}")
    
    print("\n🎉 Évaluation terminée!")
