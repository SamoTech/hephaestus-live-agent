# Hephaestus: Live AI Visual Assistant 🛠️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![Gemini 2.0](https://img.shields.io/badge/gemini-2.0-orange.svg)](https://ai.google.dev/)

**Real-time multimodal AI agent powered by Google Gemini 2.0 Flash that sees your workspace, understands context, and provides intelligent assistance across multiple domains.**

Transform your workspace into an intelligent collaborative environment where AI observes through your camera, listens through your microphone, and provides real-time guidance for engineering, coding, learning, creative work, and everyday tasks.

---

## 🎯 Project Status

### Current Version: v1.0.0-alpha (Phase A Complete)

**Phase A - Foundation** ✅ COMPLETE
- [x] Backend WebSocket server with Gemini Live API integration
- [x] Frontend camera streaming and real-time UI
- [x] Text input/output communication
- [x] Periodic frame capture and analysis
- [x] Basic error handling and logging

**Phase B - Audio & Intelligence** 🚧 IN PROGRESS
- [ ] Microphone audio streaming (16-bit PCM, 16kHz)
- [ ] Audio response playback
- [ ] Advanced context management
- [ ] Conversation history and memory

**Phase C - Agentic Tools** 📋 PLANNED
- [ ] Web search integration
- [ ] Automatic code generation and file saving
- [ ] Component datasheet lookup
- [ ] Screenshot and annotation tools
- [ ] Session recording and export

**Phase D - Production Ready** 🔮 FUTURE
- [ ] Cloud deployment (Docker + K8s)
- [ ] User authentication and sessions
- [ ] Multi-user collaboration
- [ ] Advanced analytics and insights
- [ ] Mobile app (iOS/Android)

---

## 📂 Project Structure

```
hephaestus-live-agent/
├── backend/                      # FastAPI WebSocket server
│   ├── main.py                   # Main application entry point
│   ├── requirements.txt          # Python dependencies
│   ├── .env.example              # Environment variables template
│   └── config/                   # Configuration files (planned)
│       ├── prompts.py            # System prompts for different modes
│       └── settings.py           # App settings and constants
│
├── frontend/                     # React + Vite application
│   ├── src/
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # React entry point
│   │   ├── index.css             # Global styles
│   │   ├── components/           # Reusable UI components (planned)
│   │   │   ├── CameraPanel.jsx
│   │   │   ├── LogsPanel.jsx
│   │   │   ├── InputPanel.jsx
│   │   │   └── SettingsPanel.jsx
│   │   ├── hooks/                # Custom React hooks (planned)
│   │   │   ├── useWebSocket.js
│   │   │   ├── useCamera.js
│   │   │   └── useAudio.js
│   │   └── utils/                # Utility functions (planned)
│   │       ├── audioProcessor.js
│   │       └── frameCapture.js
│   ├── public/                   # Static assets
│   ├── index.html                # HTML entry point
│   ├── vite.config.js            # Vite configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   └── package.json              # Node dependencies
│
├── docs/                         # Documentation (planned)
│   ├── API.md                    # API documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── CONTRIBUTING.md           # Contribution guidelines
│   └── DEPLOYMENT.md             # Deployment guide
│
├── tests/                        # Test suites (planned)
│   ├── backend/
│   │   ├── test_websocket.py
│   │   └── test_gemini.py
│   └── frontend/
│       ├── App.test.jsx
│       └── components.test.jsx
│
├── scripts/                      # Utility scripts (planned)
│   ├── setup.sh                  # Setup automation
│   ├── deploy.sh                 # Deployment script
│   └── generate_env.py           # Environment setup helper
│
├── .github/                      # GitHub specific files (planned)
│   ├── workflows/
│   │   ├── ci.yml                # Continuous integration
│   │   └── deploy.yml            # Deployment workflow
│   └── ISSUE_TEMPLATE/
│
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+** with pip
- **Node.js 18+** with npm
- **Webcam** (and microphone for Phase B)
- **Google Gemini API Key** ([Get one free here](https://makersuite.google.com/app/apikey))

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent
```

#### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API key
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

**`.env` file:**
```env
GEMINI_API_KEY=your_actual_api_key_here
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### Running the Application

#### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate  # Activate venv if not already active
python main.py
```

Backend will start on `http://localhost:8000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

#### 4. Test the Application

1. Open browser to `http://localhost:5173`
2. Click the **orange Play button** to start camera and connect
3. Grant camera permissions when prompted
4. You should see:
   - `[SYSTEM] Connected to Hephaestus backend`
   - Live camera feed
   - Status indicator showing "LIVE" with green pulse
5. Type a message in the input box or just wait
6. Camera frames are automatically sent every 3 seconds
7. Watch for **[AGENT]** responses in the logs panel

---

## 💡 Use Cases

### For Engineers & Hardware Developers
- **Circuit design assistance**: Show your breadboard, get component recommendations
- **Debugging help**: Point camera at your circuit, describe the issue
- **Datasheet lookup**: Ask about component specifications (Phase C)
- **Schematic to code**: Convert hand-drawn circuits to code

### For Software Developers
- **Code review**: Show code on paper or whiteboard, get feedback
- **Architecture design**: Draw system diagrams, get implementation suggestions
- **Debugging**: Show error messages on screen, get solutions
- **Pair programming**: Real-time coding assistance with visual context

### For Students & Educators
- **Math problem solving**: Write problems on paper, get step-by-step solutions
- **Language learning**: Show flashcards or objects, practice vocabulary
- **Homework help**: Show your work, get guidance without direct answers
- **Interactive tutoring**: Real-time explanations across any subject

### For Creators & Artists
- **Design feedback**: Show sketches, get composition suggestions
- **Color palette**: Show physical swatches, get digital color codes
- **Layout assistance**: Show design mockups, get improvement ideas
- **Creative brainstorming**: Visual + conversational ideation

### For General Productivity
- **Document OCR**: Show documents, extract and process text
- **Recipe assistance**: Show ingredients, get cooking guidance
- **Assembly instructions**: Show parts, get step-by-step assembly help
- **Real-time translation**: Show text in any language, get translations

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (async WebSocket support)
- **AI Engine**: Google Gemini 2.0 Flash (multimodal Live API)
- **Language**: Python 3.9+
- **Real-time**: WebSockets for bidirectional streaming
- **Async**: asyncio for concurrent operations

### Frontend
- **Framework**: React 18 (with Hooks)
- **Build Tool**: Vite (fast HMR and optimization)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Media**: WebRTC getUserMedia API
- **Communication**: WebSocket API

### AI & APIs
- **Model**: gemini-2.0-flash-exp
- **Capabilities**: Text, Vision, Audio (Phase B)
- **Response Mode**: Streaming (real-time)
- **Context**: Multimodal (text + images + audio)

---

## 📋 Detailed Roadmap

### Phase A: Foundation ✅ (Current - v1.0.0-alpha)
**Goal**: Basic working prototype with camera and text

**Completed**:
- ✅ FastAPI backend with WebSocket endpoint
- ✅ Gemini Live API integration (server-to-server)
- ✅ React frontend with camera streaming
- ✅ Real-time text input/output
- ✅ Periodic frame capture (every 3 seconds)
- ✅ Basic UI with logs panel
- ✅ Error handling and connection management
- ✅ Project structure and documentation

**Deliverable**: Working demo that can see and respond to text

---

### Phase B: Audio & Context (Q2 2026) 🚧
**Goal**: Add voice interaction and smarter context management

**Tasks**:
- [ ] **Audio Input Pipeline**
  - Microphone capture via getUserMedia
  - AudioContext + AudioWorklet for processing
  - PCM encoding (16-bit, 16kHz mono)
  - Streaming chunks to backend via WebSocket
  - Backend forwarding to Gemini Live API

- [ ] **Audio Output Pipeline**
  - Receive audio responses from Gemini (24kHz PCM)
  - Decode and buffer audio chunks
  - Play through Web Audio API
  - Visual feedback (waveform or indicator)

- [ ] **Context Management**
  - Conversation history tracking
  - Session persistence (localStorage)
  - Context window optimization
  - Smart frame selection (motion detection)

- [ ] **Enhanced UI**
  - Audio input level meter
  - Push-to-talk vs continuous modes
  - Audio playback controls
  - Session history sidebar

**Deliverable**: Full voice + vision interaction

---

### Phase C: Agentic Tools (Q3 2026) 📋
**Goal**: Add autonomous capabilities for real productivity

**Tasks**:
- [ ] **Tool System Architecture**
  - Plugin-based tool registry
  - Function calling with Gemini
  - Tool execution sandboxing
  - Result streaming back to user

- [ ] **Core Tools**
  - `web_search`: DuckDuckGo/Google search integration
  - `save_code`: Save generated code to local files
  - `screenshot`: Capture and annotate current view
  - `datasheet_lookup`: Component specs from Octopart/Mouser
  - `calculate`: Advanced math and unit conversions
  - `translate`: Multi-language translation

- [ ] **Code Generation**
  - Language-specific templates
  - Syntax validation
  - File tree creation
  - Git integration (optional)

- [ ] **Export & Documentation**
  - Session recording (video + transcript)
  - Export to PDF/Markdown/LaTeX
  - Auto-generated project reports
  - Shareable session links

**Deliverable**: AI agent that can autonomously complete tasks

---

### Phase D: Production & Scale (Q4 2026) 🔮
**Goal**: Deploy as production-ready SaaS application

**Tasks**:
- [ ] **Infrastructure**
  - Docker containerization (backend + frontend)
  - Kubernetes deployment manifests
  - Cloud hosting (AWS/GCP/Azure)
  - CDN for frontend assets
  - Load balancing and auto-scaling

- [ ] **Authentication & Security**
  - User registration and login (OAuth2)
  - API key management per user
  - Rate limiting and quotas
  - HTTPS/WSS encryption
  - GDPR compliance (data handling)

- [ ] **Multi-User Features**
  - Shared workspaces (team collaboration)
  - Real-time collaborative annotations
  - Role-based permissions
  - Session sharing and playback

- [ ] **Analytics & Monitoring**
  - Usage metrics (Prometheus + Grafana)
  - Error tracking (Sentry)
  - Performance monitoring
  - User behavior analytics
  - A/B testing framework

- [ ] **Advanced Features**
  - Custom model fine-tuning (per organization)
  - Voice cloning for personalized responses
  - AR overlay support (mobile)
  - Offline mode (limited functionality)
  - API for third-party integrations

- [ ] **Mobile Apps**
  - React Native iOS app
  - React Native Android app
  - Camera + AR Kit integration
  - Push notifications

**Deliverable**: Full SaaS platform with mobile apps

---

### Phase E: Enterprise & Education (2027) 🏢
**Goal**: Specialized versions for enterprise and education

**Tasks**:
- [ ] **Enterprise Edition**
  - Self-hosted deployment options
  - SSO integration (SAML, LDAP)
  - Advanced security and compliance
  - Custom branding and white-labeling
  - Dedicated support and SLAs

- [ ] **Education Platform**
  - Curriculum integration
  - Student progress tracking
  - Assignment grading assistance
  - Classroom management tools
  - Accessibility features (screen readers, captions)
  - Parent/teacher dashboards

**Deliverable**: Enterprise-ready product with education focus

---

## 🎨 Customization

### System Prompts

Customize AI behavior by editing `backend/main.py`:

```python
CONFIG = {
    "system_instruction": (
        "You are Hephaestus, a helpful real-time visual AI assistant. "
        "Your role: [customize here]"
    ),
}
```

### UI Themes

Modify colors in `frontend/src/App.jsx`:

```javascript
const THEME = {
  primary: '#ea580c',      // Orange accent
  background: '#020205',   // Dark background
  panel: '#0a0a12',        // Panel background
  border: '#222',          // Border color
};
```

### Frame Capture Rate

Adjust in `frontend/src/App.jsx`:

```javascript
setInterval(() => {
  // Capture frame logic
}, 3000); // Change 3000 to desired ms
```

---

## 🧪 Development

### Running Tests (Planned)

```bash
# Backend tests
cd backend
pytest tests/

# Frontend tests
cd frontend
npm test
```

### Code Formatting

```bash
# Python (Black)
cd backend
black .

# JavaScript (Prettier)
cd frontend
npm run format
```

### Linting

```bash
# Python (Flake8)
cd backend
flake8 .

# JavaScript (ESLint)
cd frontend
npm run lint
```

---

## 🐛 Troubleshooting

### Backend Issues

**"Module 'google.genai' not found"**
```bash
pip install --upgrade google-genai
```

**"WebSocket connection failed"**
- Ensure backend is running on port 8000
- Check firewall settings
- Verify GEMINI_API_KEY is set correctly

**"Invalid API key"**
- Get a new key from https://makersuite.google.com/app/apikey
- Ensure no extra spaces in .env file
- Restart backend after updating .env

### Frontend Issues

**"Camera not accessible"**
- Grant camera permissions in browser
- Check if camera is used by another app
- Try HTTPS instead of HTTP (browser security)

**"Cannot connect to WebSocket"**
- Ensure backend is running
- Check WebSocket URL in App.jsx (default: ws://localhost:8000/ws/live)
- Look for CORS errors in browser console

**"No responses from AI"**
- Check browser console for errors
- Verify backend logs show "Connected to Gemini Live session"
- Test with simple text message first

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation
4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- **Code Style**: Follow PEP 8 (Python) and Airbnb style (JavaScript)
- **Commits**: Use conventional commits (feat, fix, docs, refactor, test)
- **Tests**: Add tests for new features (when test suite is ready)
- **Documentation**: Update README and docs/ as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini Team** for the powerful multimodal AI capabilities
- **FastAPI Team** for the excellent async web framework
- **React & Vite Communities** for modern frontend tooling
- **Tailwind CSS** for rapid UI development
- **All Contributors** who help make this project better

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
- **Email**: [samo.hossam@gmail.com](mailto:samo.hossam@gmail.com)
- **Twitter/X**: [@OssamaHashim](https://x.com/OssamaHashim)
- **LinkedIn**: [Ossama Hashim](https://www.linkedin.com/in/ossamahashim/)

---

## ⭐ Star History

If you find Hephaestus useful, please consider giving it a star! It helps the project grow and reach more developers.

---

## 🗺️ Vision

Our goal is to make Hephaestus the **go-to real-time AI assistant for visual tasks**. We envision a future where:

- Engineers debug circuits by simply pointing their camera
- Students solve homework with real-time visual guidance
- Developers get code reviews from whiteboard sketches
- Creators receive instant feedback on their designs
- Anyone can access expert-level assistance through their camera

Join us in building this future! 🚀

---

**Created with ❤️ by [Ossama Hashim (SamoTech)](https://github.com/SamoTech)**

*Building the future of AI-assisted creation, one workspace at a time.*