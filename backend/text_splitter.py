from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List

def get_text_chunks(text: str) -> List[str]:
    """
    Splits a large text string into smaller chunks.
    
    Args:
        text: The complete raw text.

    Returns:
        A list of text chunks.
    """
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000, 
        chunk_overlap=1000
    )
    chunks = text_splitter.split_text(text)
    return chunks