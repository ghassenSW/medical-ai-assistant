"""
FastAPI Backend for Medical AI Assistant
Uses RAG Fusion (Retrieval Augmented Generation + RRF) with Gemini 2.5 Flash
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

# LangChain and RAG imports
from astrapy import DataAPIClient
from langchain_core.documents import Document
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.load import dumps, loads
from langchain_core.runnables import RunnableLambda
from langchain_core.prompts import ChatPromptTemplate
from langsmith import traceable
from operator import itemgetter

load_dotenv(override=True)

# Initialize Gemini Client
client_genai = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# ASTRA DB CONNECTION (for RAG)
astra_client = DataAPIClient(os.getenv("ASTRA_DB_APPLICATION_TOKEN"))
db = astra_client.get_database_by_api_endpoint( 
    os.getenv("ASTRA_DB_API_ENDPOINT")
)

# EMBEDDING MODEL SETUP
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
collection = db.get_collection("embeddings_collection")

# ========== CONVERSATION MEMORY ==========
conversation_memory: Dict[str, List[Dict[str, str]]] = {}

def get_conversation_history(session_id: str, limit: int = 5) -> str:
    if session_id not in conversation_memory:
        return "No previous conversation"
    history = conversation_memory[session_id][-limit:]
    return "\n\n".join([f"{msg['role'].title()}: {msg['content']}" for msg in history])

def add_to_memory(session_id: str, role: str, content: str):
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    conversation_memory[session_id].append({"role": role, "content": content})
    if len(conversation_memory[session_id]) > 20:
        conversation_memory[session_id] = conversation_memory[session_id][-20:]

# ========== RAG FUSION FUNCTIONS ==========

@traceable(name="retrieve_documents")
def retrieve_documents(query, limit=5):
    """
    Retrieves relevant medical documents from Astra DB vector database
    """
    # 1. Embed the query
    query_vector = embedding_model.embed_query(query)
    
    # 2. Search AstraDB
    results = collection.find(
        sort={"$vector": query_vector},
        limit=limit,
        projection={"text": 1, "$vector": 0}
    )
    
    # 3. Convert to LangChain Documents
    found_docs = []
    for doc_data in results:
        if "text" in doc_data:
            found_docs.append(Document(page_content=doc_data["text"]))
    
    return found_docs

@traceable(name="generate_queries")
def generate_queries(question):
    """
    Generates 4 variations of the question using Gemini 2.5 Flash
    """
    rag_instructions = """You are a helpful medical assistant. 
    Generate 4 different search queries based on the user's question 
    to retrieve comprehensive medical advice from a vector database. 
    Focus on symptoms, treatments, and first aid.
    Output ONLY the queries separated by newlines."""
    
    response = client_genai.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"User Question: {question}",
        config=types.GenerateContentConfig(
            system_instruction=rag_instructions,
            temperature=0.7 
        )
    )
    
    return [q.strip() for q in response.text.split("\n") if q.strip()]

# ---------------------------------------------------------
# 🔥 NEW PART: RAG FUSION LOGIC (Replaces get_unique_union)
# ---------------------------------------------------------
@traceable(name="reciprocal_rank_fusion")
def reciprocal_rank_fusion(results: list[list], k=60):
    """
    Reciprocal Rank Fusion (RRF) algorithm to re-rank documents.
    Args:
        results: List of lists of Documents (one list per query variation).
        k: Smoothing constant (default 60).
    Returns:
        List[Document]: Unique documents sorted by relevance score.
    """
    fused_scores = {}

    # Iterate through the lists of documents (one list for each of the 4 generated queries)
    for docs in results:
        for rank, doc in enumerate(docs):
            # Serialize doc to use as a unique dictionary key
            doc_str = dumps(doc)
            
            if doc_str not in fused_scores:
                fused_scores[doc_str] = 0
            
            # RRF Formula: 1 / (rank + k)
            # Documents that appear early (low rank) in multiple lists get higher scores
            fused_scores[doc_str] += 1 / (rank + k)

    # Sort documents by score (Highest score = Most relevant)
    reranked_results = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)

    # Return only the documents (we strip the score here for the prompt)
    return [loads(doc) for doc, score in reranked_results]

# ---------------------------------------------------------
# BUILD RAG CHAIN WITH FUSION
# ---------------------------------------------------------

query_generator = RunnableLambda(generate_queries)
retriever = RunnableLambda(retrieve_documents)

# The Logic: 
# 1. Generate 4 Queries -> 2. Retrieve docs for EACH -> 3. Fuse & Re-rank
retrieval_chain = (
    query_generator
    | retriever.map()
    | reciprocal_rank_fusion  # <--- This is the key change
)

@traceable(name="call_gemini_with_rag")
def call_gemini_with_rag(prompt_value):
    """
    Calls Gemini with RAG context
    """
    prompt_str = prompt_value.to_string()
    
    response = client_genai.models.generate_content(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(
            temperature=0.3, # Lower temperature for medical accuracy
        ),
        contents=prompt_str
    )
    
    return response.text

# RAG PROMPT TEMPLATE
rag_template = """You are an intelligent medical AI assistant for Tunisia.

**CONVERSATION HISTORY:**
{conversation_history}

**RETRIEVED MEDICAL CONTEXT (Ranked by Relevance):**
{context}

**USER QUESTION:** {question}

**YOUR INSTRUCTIONS:**
1. Consider the conversation history for context.
2. Use the retrieved medical context to provide accurate answers.
3. For medical questions: Provide clear info with disclaimers.
4. For emergencies: Recommend calling SAMU (190).
5. Be professional and empathetic.

Your response:"""

rag_prompt = ChatPromptTemplate.from_template(rag_template)

# FINAL RAG CHAIN
final_rag_chain = (
    {
        "context": retrieval_chain, 
        "question": itemgetter("question"), 
        "conversation_history": itemgetter("conversation_history")
    }
    | rag_prompt
    | RunnableLambda(call_gemini_with_rag)
)

# ========== FASTAPI SERVER ==========

app = FastAPI(title="Medical AI Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"
    context: Dict[str, Any] = {}

class HealthResponse(BaseModel):
    status: str
    message: str
    model: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "ok",
        "message": "Medical AI Assistant API is running",
        "model": "gemini-2.5-flash + RAG Fusion"
    }

@app.post("/api/chat")
async def chat_stream(request: ChatRequest):
    async def generate():
        try:
            history = get_conversation_history(request.session_id)
            
            # Invoke RAG Fusion Chain
            response_text = final_rag_chain.invoke(
                {
                    "question": request.message,
                    "conversation_history": history
                },
                config={"run_name": "Medical RAG Query"}
            )
            
            add_to_memory(request.session_id, "user", request.message)
            add_to_memory(request.session_id, "assistant", response_text)
            
            for char in response_text:
                yield f"data: {json.dumps({'text': char})}\n\n"
                await asyncio.sleep(0.005)
                
        except Exception as e:
            error_message = f"Error: {str(e)}"
            print(f"❌ Chat error: {error_message}")
            yield f"data: {json.dumps({'text': error_message})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 Starting Medical AI Assistant API with RAG Fusion")
    print("="*60)
    uvicorn.run(app, host="0.0.0.0", port=8000)