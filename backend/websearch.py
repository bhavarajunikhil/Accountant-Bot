from duckduckgo_search import DDGS
from typing import List

def get_recent_news(query: str, max_results: int = 3) -> str:
    try:
        results = []
        with DDGS() as ddgs:
            # We add "latest news" to the query to encourage news results
            # or use the specific news() method if strict news is required.
            # Here we use text search with a focus on recent info.
            search_results = list(ddgs.text(f"{query} latest news", max_results=max_results))
            
            if not search_results:
                return "No recent news found."

            for item in search_results:
                title = item.get('title', 'No Title')
                body = item.get('body', 'No Content')
                source = item.get('href', 'Unknown Source')
                results.append(f"Source: {source}\nTitle: {title}\nSnippet: {body}")
        
        formatted_news = "\n---\n".join(results)
        return f"RECENT NEWS FOUND:\n{formatted_news}"

    except Exception as e:
        print(f"Error fetching news: {e}")
        return "Could not fetch recent news at this time."