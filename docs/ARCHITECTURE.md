# Hephaestus Architecture

This document describes the system architecture, design decisions, and technical implementation details of Hephaestus.

## System Overview

```
┌──────────────────────────────────────────┐
│              Browser (Client)              │
│  ┌──────────────────────────────────┐  │
│  │   React Frontend (Vite)      │  │
│  │   - Camera Capture           │  │
│  │   - Audio Capture (Phase B)  │  │
│  │   - WebSocket Client         │  │
│  │   - UI Components            │  │
│  └──────────────────────────────────┘  │
└────────────────┬─────────────────────────┘
                 │ WebSocket (ws://)
                 │ JSON Messages
                 │
┌────────────────┴─────────────────────────┐
│      FastAPI Backend (Python)           │
│  ┌──────────────────────────────────┐  │
│  │   WebSocket Handler         │  │
│  │   - Message Router          │  │
│  │   - Frame Processing        │  │
│  │   - Audio Processing        │  │
│  └──────────────────────────────────┘  │
└────────────────┬─────────────────────────┘
                 │ HTTPS/WebSocket
                 │ Live API Protocol
                 │
┌────────────────┴─────────────────────────┐
│       Google Gemini Live API            │
│       (gemini-2.0-flash-exp)            │
│  - Multimodal Understanding            │
│  - Real-time Streaming Responses       │
│  - Context Management                  │
└──────────────────────────────────────────┘
```

## Component Details

### Frontend (React + Vite)

#### Components

**App.jsx** (Main Component)
- Manages application state
- Handles WebSocket lifecycle
- Coordinates camera and audio
- Renders UI panels

**Planned Components**:
- `CameraPanel`: Camera controls and preview
- `LogsPanel`: Message history display
- `InputPanel`: Text and voice input
- `SettingsPanel`: Configuration options

#### Media Capture Pipeline

```javascript
getUserMedia() → MediaStream
  │
  ├── Video Track → <video> element
  │        │
  │        └── Canvas → toBlob() → Base64 → WebSocket
  │
  └── Audio Track → AudioContext (Phase B)
           │
           └── ScriptProcessor → PCM → Base64 → WebSocket
```

#### WebSocket Message Format

**Client to Server**:
```json
{
  "type": "text",
  "text": "What do you see?"
}

{
  "type": "image",
  "data": "base64_jpeg_data",
  "mime_type": "image/jpeg"
}

{
  "type": "audio",
  "data": "base64_pcm_data",
  "mime_type": "audio/pcm;rate=16000"
}
```

**Server to Client**:
```json
{
  "type": "model_text",
  "text": "I can see a circuit board..."
}

{
  "type": "system",
  "text": "Connected to Hephaestus backend"
}

{
  "type": "error",
  "text": "Connection failed"
}
```

### Backend (FastAPI + Python)

#### Request Flow

```
WebSocket Connection (/ws/live)
  │
  ├── Accept Connection
  │
  ├── Create Gemini Live Session
  │   client.aio.live.connect(model, config)
  │
  ├── Spawn Two Async Tasks:
  │   │
  │   ├── ws_to_gemini()
  │   │   - Read from browser WebSocket
  │   │   - Parse JSON messages
  │   │   - Forward to Gemini session
  │   │
  │   └── gemini_to_ws()
  │       - Read from Gemini session
  │       - Format responses
  │       - Send to browser WebSocket
  │
  └── Handle Disconnect
      - Close Gemini session
      - Close WebSocket
```

#### Async Architecture

```python
async with client.aio.live.connect(...) as session:
    # Two concurrent coroutines
    send_task = asyncio.create_task(ws_to_gemini(ws, session))
    recv_task = asyncio.create_task(gemini_to_ws(ws, session))
    
    # Wait for either to complete (disconnect)
    await asyncio.gather(send_task, recv_task)
```

### Gemini Live API Integration

#### Connection

```python
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

async with client.aio.live.connect(
    model="gemini-2.0-flash-exp",
    config={
        "generation_config": {
            "response_modalities": ["TEXT"],  # or ["TEXT", "AUDIO"]
        },
        "system_instruction": "...",
    },
) as session:
    # Use session for bidirectional streaming
```

#### Sending Data

```python
# Text
await session.send("What do you see?", end_of_turn=True)

# Image
await session.send({
    "mime_type": "image/jpeg",
    "data": base64_image_data,
})

# Audio (Phase B)
await session.send({
    "mime_type": "audio/pcm;rate=16000",
    "data": base64_pcm_data,
})
```

#### Receiving Responses

```python
async for response in session.receive():
    if hasattr(response, 'text') and response.text:
        # Stream text chunks
        yield response.text
```

## Data Flow

### Phase A: Text + Images

```
User types message
  → Frontend: JSON {type: "text", text: "..."}
  → WebSocket
  → Backend: Parse and forward to Gemini
  → Gemini: Process and respond
  → Backend: Receive streaming response
  → WebSocket
  → Frontend: Display in logs
  → User sees response

Camera captures frame (every 3s)
  → Frontend: Canvas → Blob → Base64
  → WebSocket: JSON {type: "image", data: "...", mime_type: "..."}
  → Backend: Forward to Gemini
  → Gemini: Analyze visual context
```

### Phase B: Add Audio (Planned)

```
Microphone input
  → Frontend: AudioContext → ScriptProcessor
  → Resample to 16kHz mono
  → Convert to 16-bit PCM
  → Chunk and encode Base64
  → WebSocket: JSON {type: "audio", data: "...", mime_type: "audio/pcm;rate=16000"}
  → Backend: Forward to Gemini
  → Gemini: Process audio + visual context
  → Gemini: Respond with text and/or audio
  → Backend: Forward audio chunks
  → Frontend: Decode and play through Web Audio API
```

## Performance Considerations

### Latency Optimization

1. **WebSocket**: Persistent connection, no HTTP overhead
2. **Streaming**: Incremental responses, no wait for completion
3. **Async**: Non-blocking I/O, concurrent operations
4. **Frame rate**: 3-second interval balances context and bandwidth

### Bandwidth

- **Text**: ~1 KB per message
- **Image** (640x480 JPEG 70%): ~50-100 KB every 3s → ~17-33 KB/s
- **Audio** (16kHz 16-bit mono): 32 KB/s (Phase B)
- **Total estimated**: ~50-65 KB/s with audio

### Scalability

- **Current**: Single server, multiple concurrent WebSocket connections
- **Phase D**: Load balancer + multiple backend instances
- **Future**: Redis for session state, message queue for async processing

## Security Architecture

### Current (Alpha)

- API key server-side only
- CORS enabled for dev (needs tightening)
- No user authentication
- No rate limiting

### Planned (Production)

- OAuth2 authentication
- JWT tokens for WebSocket auth
- Rate limiting per user
- Input validation and sanitization
- HTTPS/WSS only
- API key rotation

## Deployment Architecture (Phase D)

```
             ┌────────────────┐
             │  Load Balancer  │
             │   (NGINX)       │
             └───────┬────────┘
                    │
      ┌─────────┴─────────┐
      │                     │
┌─────┴─────┐       ┌─────┴─────┐
│  Backend 1  │       │  Backend N  │
│  (Docker)   │  ...  │  (Docker)   │
└─────┬─────┘       └─────┬─────┘
      │                     │
      └─────────┬─────────┘
                  │
       ┌────────┴────────┐
       │   Redis Cache     │
       │   (Sessions)      │
       └─────────────────┘
```

## Technology Choices

### Why FastAPI?

- Native async/await support
- WebSocket support out of the box
- Auto-generated API docs
- Fast and modern Python framework

### Why Vite?

- Ultra-fast HMR (Hot Module Replacement)
- Optimized production builds
- Modern ESM-based dev server
- Better than CRA for performance

### Why Gemini Live API?

- Multimodal (text + vision + audio)
- Real-time streaming responses
- Low latency (<300ms typical)
- Powerful vision understanding
- Cost-effective for experimentation

## Future Enhancements

### Phase C: Agentic Tools

- Function calling framework
- Tool execution sandboxing
- Result streaming

### Phase D: Production

- Kubernetes deployment
- Horizontal scaling
- Monitoring and logging
- CI/CD pipeline

### Phase E: Advanced

- Custom model fine-tuning
- Edge deployment
- Mobile apps
- Enterprise features
