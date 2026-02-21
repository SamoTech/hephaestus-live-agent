"""Application settings and constants."""

import os
from typing import List

# API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# Live API (bidiGenerateContent) compatible model confirmed via /models/live
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash-native-audio-preview-12-2025")

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

# CORS Configuration
CORS_ORIGINS: List[str] = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000"
).split(",")

# WebSocket Configuration
WS_PING_INTERVAL = int(os.getenv("WS_PING_INTERVAL", 20))
WS_PING_TIMEOUT = int(os.getenv("WS_PING_TIMEOUT", 20))
WS_MAX_SIZE = int(os.getenv("WS_MAX_SIZE", 10 * 1024 * 1024))  # 10MB

# Frame Processing
FRAME_MAX_WIDTH = int(os.getenv("FRAME_MAX_WIDTH", 1280))
FRAME_MAX_HEIGHT = int(os.getenv("FRAME_MAX_HEIGHT", 720))
FRAME_QUALITY = float(os.getenv("FRAME_QUALITY", 0.7))

# Rate Limiting (Phase D)
RATE_LIMIT_MESSAGES = int(os.getenv("RATE_LIMIT_MESSAGES", 60))  # per minute
RATE_LIMIT_IMAGES = int(os.getenv("RATE_LIMIT_IMAGES", 20))  # per minute

# Application Info
APP_NAME = "Hephaestus Live Backend"
APP_VERSION = "1.0.0-alpha"
APP_DESCRIPTION = "Real-time multimodal AI visual assistant"
