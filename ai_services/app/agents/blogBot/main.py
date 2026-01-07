import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage
from llama_index.llms.mistralai import MistralAI
from llama_index.embeddings.mistralai import MistralAIEmbedding
from llama_index.core import Settings
from dotenv import load_dotenv

load_dotenv()


MISTRAL_API_KEY = os.getenv("TON_API_KEY_MISTRAL")

llm = MistralAI(model="mistral-large-latest", 
                temperature=0.7, 
                max_tokens=3072)

embed_model = MistralAIEmbedding(model_name="mistral-embed")

Settings.llm = llm 
Settings.embed_model = embed_model 

def initialise_cozetik_brain():
    if not os.path.exists("./storage"):
        print("Indexing CoZetik docs...")

        docs = SimpleDirectoryReader("./data").load_data()
        index = VectorStoreIndex.from_documents(docs)
        #save index
        index.storage_context.persist()
    else:
        print("Loading indexing...")
        storage_context = StorageContext.from_defaults(persist_dir="./storage")
        index = load_index_from_storage(storage_context)
    
    return index

cozetik_index = initialise_cozetik_brain()
query_engine = cozetik_index.as_query_engine(similarity_top_k=3)

def generate_blog(subject):
    prompt_instruction = f"""
    Tu es l'expert Copywriter de Cozetik. 
    Ta mission : Rédiger un article de blog sur le sujet : "{subject}".
    
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
article = generate_blog("Formation 1 (Signature) : IA & Productivité - ChatGPT Pro")
print(article)g