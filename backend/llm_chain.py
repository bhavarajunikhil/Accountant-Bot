from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool, AgentType
from backend.vector_store import get_vectorstore
from backend.config import settings

# 1. Initialize LLM
llm = ChatOpenAI(temperature=0, model_name="gpt-4", api_key=settings.OPENAI_API_KEY)

# 2. Setup Retrievers
legal_store = get_vectorstore(namespace="legal_docs")
news_store = get_vectorstore(namespace="news_feed")

legal_qa = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff", retriever=legal_store.as_retriever()
)
news_qa = RetrievalQA.from_chain_type(
    llm=llm, chain_type="stuff", retriever=news_store.as_retriever()
)

# 3. Define Tools for the Agent
tools = [
    Tool(
        name="Tax Law Archive",
        func=legal_qa.run,
        description="Use this for questions about the Income Tax Act 1961, Finance Act 2025, sections, laws, and static rules."
    ),
    Tool(
        name="Latest News",
        func=news_qa.run,
        description="Use this for recent updates, news articles, government announcements, and changes in 2025."
    )
]

# 4. Create the Agent
agent = initialize_agent(
    tools, 
    llm, 
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, 
    verbose=True,
    handle_parsing_errors=True
)

def process_query(query: str):
    return agent.run(query)