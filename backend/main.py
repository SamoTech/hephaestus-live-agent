import os
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from google import genai

load_dotenv()

app = FastAPI(title="Hephaestus Live Backend")

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client with API key
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

# Model configuration
MODEL = "gemini-2.0-flash-exp"  # Supports text + vision
CONFIG = {
    "generation_config": {
        "response_modalities": ["TEXT"],  # Phase A: text responses only
    },
    "system_instruction": (
        "You are Hephaestus, a helpful real-time visual AI assistant. "
        "You can see what the user shows you through their camera. "
        "Provide clear, practical guidance for engineering, coding, education, "
        "creative work, and general tasks. Be concise but thorough."
    ),
}


async def ws_to_gemini(ws: WebSocket, session):
    """
    Read messages from browser WebSocket and forward to Gemini Live session.
    Expected JSON formats:
      { "type": "text", "text": "user message" }
      { "type": "image", "data": "base64_data", "mime_type": "image/jpeg" }
    """
    try:
        while True:
            msg = await ws.receive_text()
            data = json.loads(msg)

            if data["type"] == "text":
                await session.send(data["text"], end_of_turn=True)
                
            elif data["type"] == "image":
                # Send image data to Gemini
                await session.send(
                    {
                        "mime_type": data.get("mime_type", "image/jpeg"),
                        "data": data["data"],
                    }
                )
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Error in ws_to_gemini: {e}")


async def gemini_to_ws(ws: WebSocket, session):
    """
    Read streaming responses from Gemini Live session and forward to browser.
    """
    try:
        async for response in session.receive():
            # Extract text from response
            if hasattr(response, 'text') and response.text:
                await ws.send_text(json.dumps({
                    "type": "model_text",
                    "text": response.text,
                }))
            
            # Handle server content if present
            if hasattr(response, 'server_content') and response.server_content:
                if hasattr(response.server_content, 'model_turn'):
                    model_turn = response.server_content.model_turn
                    if hasattr(model_turn, 'parts'):
                        text_chunks = []
                        for part in model_turn.parts:
                            if hasattr(part, 'text') and part.text:
                                text_chunks.append(part.text)
                        
                        if text_chunks:
                            await ws.send_text(json.dumps({
                                "type": "model_text",
                                "text": "".join(text_chunks),
                            }))
                            
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"Error in gemini_to_ws: {e}")


@app.get("/")
async def root():
    return {
        "service": "Hephaestus Live Backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "websocket": "/ws/live"
        }
    }


@app.websocket("/ws/live")
async def live_endpoint(ws: WebSocket):
    """
    WebSocket endpoint that bridges browser to Gemini Live API.
    """
    await ws.accept()
    print("[BACKEND] Client connected to /ws/live")
    
    try:
        # Connect to Gemini Live API
        async with client.aio.live.connect(
            model=MODEL,
            config=CONFIG,
        ) as live_session:
            print("[BACKEND] Connected to Gemini Live session")
            
            # Send welcome message
            await ws.send_text(json.dumps({
                "type": "system",
                "text": "Connected to Hephaestus AI. Camera feed active."
            }))
            
            # Create bidirectional streaming tasks
            send_task = asyncio.create_task(ws_to_gemini(ws, live_session))
            recv_task = asyncio.create_task(gemini_to_ws(ws, live_session))
            
            # Wait for either task to complete (disconnect)
            await asyncio.gather(send_task, recv_task, return_exceptions=True)
            
    except WebSocketDisconnect:
        print("[BACKEND] Client disconnected")
    except Exception as e:
        print(f"[BACKEND] Error: {e}")
        try:
            await ws.send_text(json.dumps({
                "type": "error",
                "text": f"Backend error: {str(e)}"
            }))
        except:
            pass
    finally:
        try:
            await ws.close()
        except:
            pass
        print("[BACKEND] WebSocket connection closed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
