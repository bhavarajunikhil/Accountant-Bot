import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
from langchain.schema import Document

def scrape_url(url):
    """Helper to extract text from a URL."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(url, headers=headers, timeout=5)
        if response.status_code != 200:
            return None
        soup = BeautifulSoup(response.content, 'html.parser')
        # Extract paragraphs to avoid navbars/footers
        text = ' '.join([p.get_text() for p in soup.find_all('p')])
        return text[:4000]  # Limit content length
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def get_latest_news(query: str = "Income Tax Act 2025 India", max_results: int = 10):
    """Searches DDG, scrapes content, and returns LangChain Documents."""
    print(f"Searching for: {query}")
    documents = []
    
    with DDGS() as ddgs:
        # Get news results
        results = list(ddgs.news(query, max_results=max_results))
        
        for result in results:
            url = result['url']
            title = result['title']
            date = result['date']
            
            content = scrape_url(url)
            if content:
                doc = Document(
                    page_content=content,
                    metadata={
                        "source": "news",
                        "title": title,
                        "url": url,
                        "date": date
                    }
                )
                documents.append(doc)
                print(f"Scraped: {title}")
                
    return documents