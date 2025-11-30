from langchain_community.document_loaders import PyPDFLoader
from backend.text_splitter import get_text_splitter # Assuming you have a splitter here
from backend.vector_store import add_documents_to_db

def process_tax_pdf(file_path: str):
    """Reads PDF, splits it, and uploads to 'legal_docs' namespace."""
    print(f"Processing PDF: {file_path}")
    
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    # Split text (using your existing text_splitter logic or standard Recursive)
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    split_docs = text_splitter.split_documents(documents)
    
    # Add metadata
    for doc in split_docs:
        doc.metadata['source'] = "Income Tax Act 2025"
        doc.metadata['type'] = "legal"

    # Upload to Vector DB under 'legal_docs' namespace
    add_documents_to_db(split_docs, namespace="legal_docs")
    return {"status": "success", "chunks": len(split_docs)}