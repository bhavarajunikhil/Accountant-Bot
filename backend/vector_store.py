import os
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema.document import Document
from typing import List

# Define the path for the local vector store
VECTOR_STORE_PATH = "faiss_index"

def get_embeddings_model():
    """Initializes and returns the OpenAI embeddings model."""
    # This automatically loads the OPENAI_API_KEY from the environment
    return OpenAIEmbeddings()

def create_and_save_vector_store(text_chunks: List[str]):
    """
    Creates a FAISS vector store from text chunks,
    generates embeddings, and saves it locally.
    
    Args:
        text_chunks: A list of text chunks.
    """
    try:
        embeddings = get_embeddings_model()
        vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
        vector_store.save_local(VECTOR_STORE_PATH)
    except Exception as e:
        print(f"Error creating vector store: {e}")
        raise

def get_similar_docs(query: str, k: int = 4) -> List[Document]:
    """
    Loads the local vector store and retrieves the k most
    similar documents for a given query.
    
    Args:
        query: The user's question.
        k: The number of similar documents to retrieve.

    Returns:
        A list of matching Document objects.
    """
    if not os.path.exists(VECTOR_STORE_PATH):
        raise FileNotFoundError(f"Vector store not found at {VECTOR_STORE_PATH}. Please process documents first.")
    
    try:
        embeddings = get_embeddings_model()
        db = FAISS.load_local(
            VECTOR_STORE_PATH, 
            embeddings, 
            allow_dangerous_deserialization=True # Required for FAISS
        )
        
        docs = db.similarity_search(query, k=k)
        return docs
    except Exception as e:
        print(f"Error retrieving similar docs: {e}")
        raise