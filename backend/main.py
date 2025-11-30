from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from backend.llm_chain import process_query
from backend.websearch import get_latest_news
from backend.vector_store import add_documents_to_db
from backend.data_loader import process_tax_pdf
import os

app = FastAPI()

class Query(BaseModel):
    text: str

@app.post("/chat")
def chat(query: Query):
    """The main chat endpoint."""
    response = process_query(query.text)
    return {"response": response}

@app.post("/update-news")
def update_news(background_tasks: BackgroundTasks):
    """Scrapes top 10 news and adds to Vector DB."""
    def task():
        docs = get_latest_news("Income Tax Act 2025 India updates")
        add_documents_to_db(docs, namespace="news_feed")
    
    background_tasks.add_task(task)
    return {"status": "News update started in background"}

@app.post("/update-pdf")
def update_pdf(background_tasks: BackgroundTasks):
    """Processes the PDF located in root."""
    pdf_path = "income-tax-act.pdf" # Ensure file exists in root
    if os.path.exists(pdf_path):
        background_tasks.add_task(process_tax_pdf, pdf_path)
        return {"status": "PDF processing started"}
    return {"status": "PDF file not found"}