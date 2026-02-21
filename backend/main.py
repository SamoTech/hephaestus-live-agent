import os
import json
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from google import genai

from config.settings import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_CONFIG,
    HOST,
    PORT,
    LOG_LEVEL,
    CORS_ORIGINS,
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
)
from config.prompts import get_prompt

load_dotenv()

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Gemini client: graceful handling if API key is missing ---
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    print("[WARNING] GEMINI_API_KEY is not set. AI features will be disabled.")

# Build runtime config from settings + prompts
CONFIG = {
    **GEMINI_CONFIG,
    "system_instruction": get_prompt("default"),
}


async def ws_to_gemini(ws: WebSocket, session):
    """
    Forward browser WebSocket messages to Gemini Live session.
    Supported message types:
      { "type": "text",  "text": "..." }
      { "type": "image", "data": "<base64>", "mime_type": "image/jpeg" }
    """
    try:
        while True:
            msg = await ws.receive_text()
            data = json.loads(msg)

            if data.get("type") == "text":
                await session.send(data["text"], end_of_turn=True)

            elif data.get("type") == "image":
                await session.send({
                    "mime_type": data.get("mime_type", "image/jpeg"),
                    "data": data["data"],
                })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[ws_to_gemini] Error: {e}")


async def gemini_to_ws(ws: WebSocket, session):
    """
    Forward Gemini Live streaming responses back to browser.
    """
    try:
        async for response in session.receive():
            # Direct text on response object
            if hasattr(response, "text") and response.text:
                await ws.send_text(json.dumps({
                    "type": "model_text",
                    "text": response.text,
                }))

            # Structured server_content chunks
            if hasattr(response, "server_content") and response.server_content:
                model_turn = getattr(response.server_content, "model_turn", None)
                if model_turn:
                    parts = getattr(model_turn, "parts", [])
                    text_chunks = [
                        part.text for part in parts
                        if hasattr(part, "text") and part.text
                    ]
                    if text_chunks:
                        await ws.send_text(json.dumps({
                            "type": "model_text",
                            "text": "".join(text_chunks),
                        }))

    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"[gemini_to_ws] Error: {e}")


@app.get("/")
async def root():
    return {
        "service": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
        "gemini_configured": bool(client),
        "endpoints": {"websocket": "/ws/live"},
    }


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "gemini_ready": bool(client),
    }


@app.websocket("/ws/live")
async def live_endpoint(ws: WebSocket):
    await ws.accept()
    print("[BACKEND] Client connected to /ws/live")

    # Reject early if API key is missing
    if not client:
        await ws.send_text(json.dumps({
            "type": "error",
            "text": "GEMINI_API_KEY is missing. Please configure it in the backend .env file.",
        }))
        await ws.close()
        return

    try:
        async with client.aio.live.connect(
            model=GEMINI_MODEL,
            config=CONFIG,
        ) as live_session:
            print("[BACKEND] Connected to Gemini Live session")

            await ws.send_text(json.dumps({
                "type": "system",
                "text": "Connected to Hephaestus AI. Camera feed active.",
            }))

            send_task = asyncio.create_task(ws_to_gemini(ws, live_session))
            recv_task = asyncio.create_task(gemini_to_ws(ws, live_session))

            await asyncio.gather(send_task, recv_task, return_exceptions=True)

    except WebSocketDisconnect:
        print("[BACKEND] Client disconnected")
    except Exception as e:
        print(f"[BACKEND] Error: {e}")
        try:
            await ws.send_text(json.dumps({
                "type": "error",
                "text": f"Backend error: {str(e)}",
            }))
        except Exception:
            pass
    finally:
        try:
            await ws.close()
        except Exception:
            pass
        print("[BACKEND] WebSocket connection closed")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        log_level=LOG_LEVEL.lower(),
        reload=False,
    )
