# Hephaestus: Live AI Visual Assistant 🛠️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Gemini 2.5](https://img.shields.io/badge/gemini-2.5%20flash%20native%20audio-orange.svg)](https://ai.google.dev/)
[![Release](https://img.shields.io/github/v/release/SamoTech/hephaestus-live-agent)](https://github.com/SamoTech/hephaestus-live-agent/releases)

**Real-time multimodal AI agent powered by Google Gemini 2.5 Flash Native Audio that sees your workspace through the camera and responds with live voice.**

Hephaestus connects to Gemini's Live API over a persistent WebSocket, streams camera frames in real time, and plays back the AI's spoken responses directly in the browser — no plugins, no external services.

---

## ✨ What's Working Right Now (v1.0)

| Feature | Status |
|---|---|
| Persistent WebSocket to Gemini Live API | ✅ Stable |
| Camera feed streaming (JPEG frames every 3 s) | ✅ Live |
| Text input → AI response | ✅ Working |
| AI voice response (PCM audio playback) | ✅ Working |
| Thought-part filtering (internal reasoning hidden) | ✅ Fixed |
| WinError 10054 / keepalive ping suppression | ✅ Fixed |
| Mute / unmute AI voice | ✅ Working |
| SPEAKING badge while AI talks | ✅ Working |
| Auto-reconnect on disconnect | ✅ Working |
| SDK warning suppression | ✅ Fixed |

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **Webcam**
- **Google Gemini API Key** — [Get one free here](https://aistudio.google.com/app/apikey)
  > Must have access to `gemini-2.5-flash-native-audio-preview` (Live API)

### 1. Clone

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS / Linux

pip install -r requirements.txt

cp .env.example .env
# Open .env and set GEMINI_API_KEY=your_key_here

python main.py
# → Uvicorn running on http://0.0.0.0:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### 4. Use It

1. Open `http://localhost:5173`
2. Click the **▶ orange button** to start the camera
3. Grant camera permission
4. Type a message — press **Enter** or click **Send**
5. You will **hear** Gemini speak the response through your speakers
6. The **SPEAKING** badge pulses on the camera panel while audio plays
7. Use the 🔊 button in the header to mute/unmute the AI voice

---

## 🏗️ Architecture

```
Browser (React + Vite)
  │
  │  WebSocket ws://localhost:8000/ws/live
  │  ├─ → { type: "text",  text: "..." }           User message
  │  ├─ → { type: "image", data: "<base64jpeg>" }  Camera frame
  │  ├─ ← { type: "model_audio", data: "<pcm>" }   AI voice (streamed)
  │  ├─ ← { type: "model_text",  text: "..." }     AI transcript
  │  ├─ ← { type: "audio_start" }                  Speaking indicator
  │  └─ ← { type: "system" / "error" }             Status / errors
  │
FastAPI (Uvicorn)
  │
  │  google-genai Live SDK
  └─ Gemini 2.5 Flash Native Audio (Live API)
       ├─ response.data        → raw 16-bit PCM @ 24 kHz
       └─ server_content.parts → text (thoughts filtered)
```

**Audio pipeline:**  
Gemini returns raw **16-bit little-endian PCM at 24 kHz mono**. The backend base64-encodes each chunk and sends it over WebSocket. The frontend decodes it into `Float32Array` and schedules it on a Web Audio API `AudioContext` with gapless back-to-back buffering.

---

## 📂 Project Structure

```
hephaestus-live-agent/
├── backend/
│   ├── main.py                # FastAPI app + WebSocket handler + Gemini bridge
│   ├── requirements.txt
│   ├── .env.example
│   ├── Dockerfile
│   └── config/
│       ├── settings.py        # GEMINI_MODEL, HOST, PORT, CORS, etc.
│       └── prompts.py         # System prompts (default, engineering, dev, education, creative)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main UI — camera, logs, audio player, WebSocket
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js     # Custom colors: hephaestus-dark, hephaestus-panel, hephaestus-orange
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── i18n/                  # Translations
│       ├── README.ar.md       # العربية
│       ├── README.zh.md       # 中文
│       ├── README.es.md       # Español
│       ├── README.fr.md       # Français
│       ├── README.de.md       # Deutsch
│       ├── README.ja.md       # 日本語
│       └── README.ru.md       # Русский
│
├── docker-compose.yml
├── CHANGELOG.md
├── CONTRIBUTING.md
└── README.md
```

---

## 🔌 API Reference

### REST

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Service info, version, active model |
| `/health` | GET | Health check + Gemini readiness |
| `/models` | GET | List all available Gemini models |
| `/models/live` | GET | List only Live-API-capable models |
| `/ws/live` | WebSocket | Bidirectional AI streaming |

### WebSocket Message Protocol

**Client → Server**
```json
{ "type": "text",  "text": "what do you see?" }
{ "type": "image", "data": "<base64>", "mime_type": "image/jpeg" }
```

**Server → Client**
```json
{ "type": "system",      "text": "Connected to Hephaestus AI. Camera feed active." }
{ "type": "model_text",  "text": "I can see a circuit board..." }
{ "type": "model_audio", "data": "<base64 PCM>", "mime_type": "audio/pcm;rate=24000" }
{ "type": "audio_start" }
{ "type": "error",       "text": "description" }
```

---

## ⚙️ Configuration

All configuration lives in `backend/.env`. Copy from `.env.example`:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional — defaults shown
GEMINI_MODEL=models/gemini-2.5-flash-native-audio-preview-12-2025
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

System prompts can be swapped by editing `backend/config/prompts.py`. Available modes: `default`, `engineering`, `developer`, `education`, `creative`.

---

## 🐳 Docker Compose

```bash
cp backend/.env.example backend/.env
# Set GEMINI_API_KEY in backend/.env

docker compose up --build
# Backend → http://localhost:8000
# Frontend → http://localhost:5173
```

---

## 🗺️ Roadmap

**v1.0 — Core (✅ Complete)**
- [x] Stable WebSocket ↔ Gemini Live API bridge
- [x] Camera frame streaming
- [x] Text input / output
- [x] Live PCM audio playback (Web Audio API)
- [x] Thought-part filtering
- [x] Mute toggle + SPEAKING indicator
- [x] Auto-reconnect with Windows WinError 10054 fix

**v1.1 — Microphone Input (🚧 Next)**
- [ ] Browser microphone → 16-bit PCM → Gemini Live audio input
- [ ] Push-to-talk and voice activity detection
- [ ] Full duplex voice conversation

**v1.2 — Agentic Tools (📋 Planned)**
- [ ] Web search integration
- [ ] Code generation + file save
- [ ] Session export (transcript + audio)
- [ ] Conversation history and memory

**v2.0 — Production (🔮 Future)**
- [ ] Docker + cloud deployment
- [ ] User authentication
- [ ] Multi-user sessions
- [ ] Mobile app

---

## 🌍 Translations

[العربية](docs/i18n/README.ar.md) · [中文](docs/i18n/README.zh.md) · [Español](docs/i18n/README.es.md) · [Français](docs/i18n/README.fr.md) · [Deutsch](docs/i18n/README.de.md) · [日本語](docs/i18n/README.ja.md) · [Русский](docs/i18n/README.ru.md)

---

## 🤝 Contributing

PRs are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Run backend in dev mode with auto-reload
uvicorn main:app --reload --port 8000

# Run frontend in dev mode
npm run dev
```

---

## 📞 Contact

- **Issues / Bugs**: [GitHub Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
- **Email**: [samo.hossam@gmail.com](mailto:samo.hossam@gmail.com)
- **X / Twitter**: [@OssamaHashim](https://x.com/OssamaHashim)
- **LinkedIn**: [Ossama Hashim](https://www.linkedin.com/in/ossamahashim/)

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

**Built by [Ossama Hashim (SamoTech)](https://github.com/SamoTech)** · *Hephaestus — the AI that sees your world.*
