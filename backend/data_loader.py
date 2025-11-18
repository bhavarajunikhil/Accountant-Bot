from pypdf import PdfReader
import io
from typing import List

def get_pdf_text(pdf_docs: List[io.BytesIO]) -> str:
    """
    Extracts text from a list of uploaded PDF file-like objects.
    
    Args:
        pdf_docs: A list of file-like objects (e.g., from FastAPI UploadFile.file).

    Returns:
        A single string containing all extracted text.
    """
    text = ""
    for pdf in pdf_docs:
        try:
            pdf_reader = PdfReader(pdf)
            for page in pdf_reader.pages:
                text += page.extract_text() or "" # Add 'or ""' for safety
        except Exception as e:
            print(f"Warning: Could not read a PDF file: {e}")
            # Continue processing other files
            pass
    return text