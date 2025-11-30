from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone
from pinecone import Pinecone as PineconeClient
from backend.config import settings

# Initialize Pinecone Client
pc = PineconeClient(api_key=settings.PINECONE_API_KEY)
embeddings = OpenAIEmbeddings(api_key=settings.OPENAI_API_KEY)

def get_vectorstore(namespace: str):
    """Returns a vector store handler for a specific namespace."""
    return Pinecone.from_existing_index(
        index_name=settings.INDEX_NAME,
        embedding=embeddings,
        namespace=namespace
    )

def add_documents_to_db(documents, namespace: str):
    """Uploads documents to the specific namespace."""
    if not documents:
        print("No documents to upload.")
        return
    
    Pinecone.from_documents(
        documents,
        embeddings,
        index_name=settings.INDEX_NAME,
        namespace=namespace
    )
    print(f"Successfully uploaded {len(documents)} documents to '{namespace}'")