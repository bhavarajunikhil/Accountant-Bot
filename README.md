# **Accountant Bot**


We have implemented the Basic Implementation of Retrieveal Augmentation over existing income tax laws, to answer the user queries on respective field.


## **Background**


Existing LLMs have made our life simple by solving many of our generic problems. But when these LLMs were asked a question which is very specific to certain domain, they hallucinate, and give very random/generic answers. This is the case with even the state of art models like GPT or LLama.

So these LLMs directly might not solve our problem, because our issue is also very specific to domain knowledge.

To Solve this, we have used Retrieval Augmentation

## RAG Framework

![RAG](https://github.com/bhavarajunikhil/Accountant-Bot/assets/146332544/9d015ec7-3c7c-43af-86b9-7b502a460af9)


## **Steps of Retrieval Augmentation Generaion**

Mechanism of RAG can be divided into three steps

**1. Ingestion**

    Preprocessing of context i.e., splitting, chunking, vectorizing and storing these vectors in vector store.

**2. Retrieval**

    Retrieving the most relevant documents for the query i.e., closest documents.

**3. Synthesis**

    Adding the relevant context to query and generating answer in required format from an LLM
