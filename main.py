import asyncio
import os
import json
import base64
from typing import Optional
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import coloredlogs
import logging

# Setup logging
coloredlogs.install(level='INFO')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Hephaestus AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# System prompt for Hephaestus
SYSTEM_PROMPT = """
You are Hephaestus, an expert AI assistant specialized in visual understanding and real-time guidance.
You can see the user's workspace through their camera and provide:
- Technical analysis of circuits, sketches, and diagrams
- Code generation and debugging assistance
- Step-by-step instructions for projects
- Educational tutoring across various subjects
- Creative feedback and suggestions

Be concise, helpful, and encouraging. When you see something in the video, describe what you observe and provide actionable guidance.
"""

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.chat_sessions = {}
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        # Initialize chat session for this connection
        self.chat_sessions[id(websocket)] = self.model.start_chat(
            history=[{"role": "user", "parts": [SYSTEM_PROMPT]},
                     {"role": "model", "parts": ["Understood. I'm Hephaestus, ready to assist with visual guidance and real-time support."]}]
        )
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        if id(websocket) in self.chat_sessions:
            del self.chat_sessions[id(websocket)]
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")
    
    async def process_message(self, websocket: WebSocket, data: dict):
        message_type = data.get("type")
        
        if message_type == "text":
            # Handle text-only message
            text = data.get("text", "")
            return await self.generate_response(websocket, text)
        
        elif message_type == "video_frame":
            # Handle video frame with optional text
            frame_data = data.get("frame", "")
            text = data.get("text", "What do you see in this image?")
            
            # Decode base64 image
            try:
                image_bytes = base64.b64decode(frame_data.split(',')[1] if ',' in frame_data else frame_data)
                return await self.generate_response(websocket, text, image_bytes)
            except Exception as e:
                logger.error(f"Error processing video frame: {e}")
                return {"error": "Failed to process video frame"}
        
        return {"error": "Unknown message type"}
    
    async def generate_response(self, websocket: WebSocket, text: str, image: Optional[bytes] = None):
        chat = self.chat_sessions.get(id(websocket))
        if not chat:
            return {"error": "No active chat session"}
        
        try:
            if image:
                # Send with image
                response = await asyncio.to_thread(
                    chat.send_message,
                    [{"mime_type": "image/jpeg", "data": image}, text]
                )
            else:
                # Text only
                response = await asyncio.to_thread(
                    chat.send_message,
                    text
                )
            
            return {
                "type": "response",
                "text": response.text,
                "timestamp": asyncio.get_event_loop().time()
            }
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {"error": str(e)}

manager = ConnectionManager()

@app.get("/")
async def root():
    return {
        "service": "Hephaestus AI Backend",
        "version": "1.0.0",
        "status": "running",
        "model": "gemini-2.0-flash-exp"
    }

@app.get("/health")
async def health():
    return {"status": "healthy", "connections": len(manager.active_connections)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    
    try:
        # Send welcome message
        await websocket.send_json({
            "type": "system",
            "message": "Connected to Hephaestus AI. Show me your workspace!"
        })
        
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Process and respond
            response = await manager.process_message(websocket, message)
            await websocket.send_json(response)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

if __name__ == "__main__":
    logger.info("🔥 Starting Hephaestus AI Backend...")
    logger.info(f"📡 WebSocket endpoint: ws://localhost:8000/ws")
    logger.info(f"🤖 AI Model: gemini-2.0-flash-exp")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )