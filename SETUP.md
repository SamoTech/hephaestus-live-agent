# Hephaestus Setup Guide

Complete step-by-step guide to get Hephaestus running on your machine.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Python 3.9+** ([Download](https://www.python.org/))
- **Webcam and microphone**
- **Google Gemini API key** ([Get one here](https://makersuite.google.com/app/apikey))

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent
```

### 2. Set Up Python Backend

#### Create a virtual environment (recommended)

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up Frontend

#### Install Node.js dependencies

```bash
npm install
```

### 4. Configure Environment Variables

#### Create .env file

```bash
cp .env.example .env
```

#### Edit .env and add your Gemini API key

```env
GEMINI_API_KEY=your_actual_api_key_here
WS_HOST=localhost
WS_PORT=8000
VITE_WS_URL=ws://localhost:8000/ws
```

**Important:** Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Running the Application

You'll need **two terminal windows**:

### Terminal 1: Start Backend Server

```bash
# Make sure virtual environment is activated
python main.py
```

You should see:
```
🔥 Starting Hephaestus AI Backend...
📡 WebSocket endpoint: ws://localhost:8000/ws
🤖 AI Model: gemini-2.0-flash-exp
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Open in Browser

Navigate to: **http://localhost:5173**

## Testing the Setup

1. **Check connection status** - You should see "Connected" in green at the top
2. **Start camera** - Click the orange play button
3. **Grant camera permissions** when prompted by your browser
4. **Test text interaction** - Type a message and press Enter
5. **Test visual interaction** - With camera on, show something to the camera and ask about it

## Troubleshooting

### Backend Issues

#### "GEMINI_API_KEY not found"
- Make sure you created `.env` file
- Verify the API key is correctly pasted
- No spaces or quotes around the key

#### "Port 8000 already in use"
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

#### "ModuleNotFoundError"
```bash
# Make sure virtual environment is activated
pip install -r requirements.txt --upgrade
```

### Frontend Issues

#### "Cannot connect to backend"
- Verify backend is running on port 8000
- Check `VITE_WS_URL` in `.env` file
- Try accessing http://localhost:8000/health in browser

#### "Camera not working"
- Grant camera permissions in browser
- Check if camera is being used by another application
- Try using HTTPS (some browsers require it for camera access)

#### "npm install fails"
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Browser Compatibility

**Recommended browsers:**
- Chrome/Chromium 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes to React files reload automatically
- **Backend**: Restart `main.py` after changes

### Debugging

#### Backend logs
```bash
# The backend prints colored logs showing:
# - Connection status
# - Incoming messages
# - AI responses
# - Errors
```

#### Frontend console
Open browser DevTools (F12) to see:
- WebSocket connection status
- Message exchange
- JavaScript errors

### Testing Without Camera

You can test text-only interactions:
1. Don't start the camera
2. Type messages in the input field
3. Hephaestus will respond without visual context

## Production Deployment

### Build Frontend

```bash
npm run build
```

This creates optimized files in `dist/` directory.

### Serve Production Build

```bash
npm run preview
```

For actual deployment, see the [Deployment Guide](docs/DEPLOYMENT.md) (coming soon).

## Next Steps

- ✅ Read [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
- ✅ Join discussions on [GitHub Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
- ✅ Report issues on [GitHub Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
- ✅ Follow [@OssamaHashim](https://x.com/OssamaHashim) for updates

## Getting Help

If you're stuck:
1. Check this guide again carefully
2. Search [existing issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
3. Ask on [GitHub Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
4. Email: [samo.hossam@gmail.com](mailto:samo.hossam@gmail.com)

Happy building! 🔨