import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage
from llama_index.llms.mistralai import MistralAI
from llama_index.embeddings.mistralai import MistralAIEmbedding
from llama_index.core import Settings

# 1. Configuration des clés API
os.environ["MISTRAL_API_KEY"] = "TON_API_KEY_MISTRAL"

# 2. Setup du modèle "Creative" (Mistral Medium est top pour ça)
# On règle la température à 0.7 pour laisser de la place à la créativité
llm = MistralAI(model="mistral-medium", temperature=0.7)
embed_model = MistralAIEmbedding(model_name="mistral-embed")

# On définit ces modèles par défaut pour LlamaIndex
Settings.llm = llm
Settings.embed_model = embed_model

def initialiser_cerveau_cozetik():
    # Créer le dossier /data s'il n'existe pas et mets tes fichiers .txt dedans
    if not os.path.exists("./storage"):
        print("Indexation des documents Cozetik...")
        # Chargement des fichiers .txt qu'on a préparé ensemble
        documents = SimpleDirectoryReader("./data").load_data()
        index = VectorStoreIndex.from_documents(documents)
        # On sauvegarde l'index pour ne pas repayer l'indexation à chaque fois
        index.storage_context.persist()
    else:
        print("Chargement de l'index existant...")
        storage_context = StorageContext.from_defaults(persist_dir="./storage")
        index = load_index_from_storage(storage_context)
    
    return index

# 3. Initialisation
index_cozetik = initialiser_cerveau_cozetik()
query_engine = index_cozetik.as_query_engine(similarity_top_k=3)

# 4. Le "Prompt" Magique pour le Blog
def generer_blog(sujet_formation):
    prompt_instruction = f"""
    Tu es l'expert Copywriter de Cozetik. 
    Ta mission : Rédiger un article de blog sur le sujet : "{sujet_formation}".
    
    CONSIGNES :
    1. Utilise les documents de formation pour le contenu technique.
    2. Garde le ton Cozetik : bienveillant, "safe place", méthode des petits pas.
    3. Structure : H1, Temps de lecture, Intro douce, 3 parties avec H2, un encadré 'L'avis de l'expert' et un CTA vers la formation.
    4. Langue : Français impeccable, style fluide et humain.
    
    Utilise les informations suivantes pour rédiger l'article :
    """
    
    response = query_engine.query(prompt_instruction)
    return response

# --- TEST ---
print("\n--- GÉNÉRATION DU BLOG ---")
article = generer_blog("Intelligence Émotionnelle - Maîtriser ses émotions")
print(article)