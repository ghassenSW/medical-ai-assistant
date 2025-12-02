"""
FastAPI Backend for Medical AI Assistant
Uses RAG (Retrieval Augmented Generation) with Gemini 2.5 Flash
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
# Store conversation history per session (in-memory)
conversation_memory: Dict[str, List[Dict[str, str]]] = {}

def get_conversation_history(session_id: str, limit: int = 5) -> str:
    """
    Retrieves conversation history for a session
    """
    if session_id not in conversation_memory:
        return "No previous conversation"
    
    history = conversation_memory[session_id][-limit:]
    return "\n\n".join([
        f"{msg['role'].title()}: {msg['content']}" 
        for msg in history
    ])

def add_to_memory(session_id: str, role: str, content: str):
    """
    Adds a message to conversation memory
    """
    if session_id not in conversation_memory:
        conversation_memory[session_id] = []
    
    conversation_memory[session_id].append({
        "role": role,
        "content": content
    })
    
    # Keep only last 20 messages to prevent memory overflow
    if len(conversation_memory[session_id]) > 20:
        conversation_memory[session_id] = conversation_memory[session_id][-20:]

# ========== RAG FUNCTIONS ==========

@traceable(name="retrieve_documents")
def retrieve_documents(query, limit=5):
    """
    Retrieves relevant medical documents from Astra DB vector database
    """
    query_vector = embedding_model.embed_query(query)
    
    results = collection.find(
        sort={"$vector": query_vector},
        limit=limit,
        projection={"text": 1, "$vector": 0}
    )
    
    found_docs = []
    for doc_data in results:
        if "text" in doc_data:
            found_docs.append(Document(page_content=doc_data["text"]))
    
    return found_docs

@traceable(name="generate_queries")
def generate_queries(question):
    """
    Generates multiple query variations for better retrieval
    """
    rag_instructions = """You are an AI language model assistant. Your task is to generate five
    different versions of the given user question to retrieve relevant documents from a vector
    database. By generating multiple perspectives on the user question, your goal is to help
    the user overcome some of the limitations of the distance-based similarity search.
    Provide these alternative questions separated by newlines."""
    
    response = client_genai.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"Original question: {question}",
        config=types.GenerateContentConfig(
            system_instruction=rag_instructions,
            temperature=0.7
        )
    )
    
    return response.text.split("\n")

@traceable(name="get_unique_union")
def get_unique_union(documents: list[list]):
    """Unique union of retrieved docs"""
    flattened_docs = [dumps(doc) for sublist in documents for doc in sublist]
    unique_docs = list(set(flattened_docs))
    return [loads(doc) for doc in unique_docs]

# BUILD RAG CHAIN
query_generator = RunnableLambda(generate_queries)
retriever = RunnableLambda(retrieve_documents)

retrieval_chain = (
    query_generator
    | retriever.map()
    | get_unique_union
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
            temperature=0,
        ),
        contents=prompt_str
    )
    
    return response.text

# RAG PROMPT TEMPLATE WITH MEMORY
rag_template = """You are an intelligent medical AI assistant for Tunisia with access to verified medical knowledge.

**CONVERSATION HISTORY:**
{conversation_history}

**RETRIEVED MEDICAL CONTEXT:**
{context}

**USER QUESTION:** {question}

**YOUR INSTRUCTIONS:**
1. Consider the conversation history for context and continuity
2. Use the retrieved medical context to provide accurate, evidence-based answers
3. For medical questions: Provide clear information with appropriate disclaimers
4. For emergencies: Give immediate first aid + recommend calling SAMU (190)
5. Always recommend consulting healthcare professionals for serious conditions
6. Be professional, empathetic, and helpful
7. Reference previous parts of the conversation when relevant

Your response:"""

rag_prompt = ChatPromptTemplate.from_template(rag_template)

# FINAL RAG CHAIN WITH MEMORY
final_rag_chain = (
    {"context": retrieval_chain, "question": itemgetter("question"), "conversation_history": itemgetter("conversation_history")}
    | rag_prompt
    | RunnableLambda(call_gemini_with_rag)
)

# ========== FASTAPI SERVER ==========

# FastAPI app
app = FastAPI(title="Medical AI Assistant API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    session_id: str = "default"  # Session ID for conversation memory
    context: Dict[str, Any] = {}

class HealthResponse(BaseModel):
    status: str
    message: str
    model: str

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "message": "Medical AI Assistant API is running",
        "model": "gemini-2.5-flash"
    }

@app.post("/api/chat")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint using RAG + Gemini 2.5 Flash with conversation memory
    """
    async def generate():
        try:
            # Get conversation history for this session
            history = get_conversation_history(request.session_id)
            
            # Use RAG chain to get intelligent response
            response_text = final_rag_chain.invoke(
                {
                    "question": request.message,
                    "conversation_history": history
                },
                config={"run_name": "Medical RAG Query"}
            )
            
            # Add user message and AI response to memory
            add_to_memory(request.session_id, "user", request.message)
            add_to_memory(request.session_id, "assistant", response_text)
            
            # Stream the response character by character for smooth UI
            for char in response_text:
                yield f"data: {json.dumps({'text': char})}\n\n"
                await asyncio.sleep(0.01)  # Smooth streaming delay
                
        except Exception as e:
            error_message = f"Error: {str(e)}"
            print(f"❌ Chat error: {error_message}")
            yield f"data: {json.dumps({'text': error_message})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Medical AI Assistant API with RAG & Memory",
        "version": "2.0.0",
        "model": "gemini-2.5-flash",
        "features": ["RAG", "Conversation Memory", "Streaming"],
        "endpoints": {
            "health": "/health",
            "chat": "/api/chat (POST)",
            "clear_memory": "/api/clear-memory/{session_id} (DELETE)"
        }
    }

@app.delete("/api/clear-memory/{session_id}")
async def clear_memory(session_id: str):
    """Clear conversation memory for a specific session"""
    if session_id in conversation_memory:
        del conversation_memory[session_id]
        return {"message": f"Memory cleared for session {session_id}"}
    return {"message": f"No memory found for session {session_id}"}

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 Starting Medical AI Assistant API with RAG")
    print("="*60)
    print("📍 Server: http://localhost:8000")
    print("📊 Health: http://localhost:8000/health")
    print("💬 Chat: http://localhost:8000/api/chat")
    print("🤖 Model: gemini-2.5-flash")
    print("🔍 RAG: Astra DB Vector Search Enabled")
    print("📚 Embeddings: all-MiniLM-L6-v2")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
