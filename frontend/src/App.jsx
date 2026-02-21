import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Square, Cpu, Zap, Send, Camera, Volume2, VolumeX } from 'lucide-react';

// --- PCM Audio Player ---
// Gemini native-audio returns raw 16-bit PCM at 24kHz mono
const createAudioPlayer = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
  let nextStartTime = 0;

  const playChunk = (base64Data) => {
    try {
      // Decode base64 -> ArrayBuffer
      const binary = atob(base64Data);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

      // Convert 16-bit PCM -> Float32
      const samples = bytes.length / 2;
      const float32 = new Float32Array(samples);
      const view = new DataView(bytes.buffer);
      for (let i = 0; i < samples; i++) {
        float32[i] = view.getInt16(i * 2, true) / 32768.0;
      }

      // Create and schedule audio buffer
      const buffer = audioCtx.createBuffer(1, samples, 24000);
      buffer.copyToChannel(float32, 0);
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const startAt = Math.max(now, nextStartTime);
      source.start(startAt);
      nextStartTime = startAt + buffer.duration;
    } catch (e) {
      console.warn('[Audio] playChunk error:', e);
    }
  };

  const resume = () => { if (audioCtx.state === 'suspended') audioCtx.resume(); };
  const reset = () => { nextStartTime = 0; };

  return { playChunk, resume, reset };
};

const App = () => {
  const [isLive, setIsLive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const logsEndRef = useRef(null);

  // Init audio player once
  useEffect(() => {
    audioPlayerRef.current = createAudioPlayer();
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = useCallback((type, message) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date().toLocaleTimeString() }]);
  }, []);

  // WebSocket connection
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/live';

    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          setIsConnected(true);
          audioPlayerRef.current?.resume();
          addLog('system', 'Connected to Hephaestus AI Backend');
        };

        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === 'system') {
            addLog('system', data.text || data.message);
          } else if (data.type === 'model_text') {
            addLog('agent', data.text);
          } else if (data.type === 'model_audio') {
            // Play PCM audio chunk
            if (!isMuted && audioPlayerRef.current) {
              audioPlayerRef.current.resume();
              audioPlayerRef.current.playChunk(data.data);
              setIsAudioPlaying(true);
              setTimeout(() => setIsAudioPlaying(false), 1000);
            }
          } else if (data.type === 'error' || data.error) {
            addLog('error', data.text || data.error);
          }
        };

        wsRef.current.onclose = () => {
          setIsConnected(false);
          audioPlayerRef.current?.reset();
          addLog('system', 'Disconnected. Reconnecting in 3s...');
          setTimeout(connectWebSocket, 3000);
        };

        wsRef.current.onerror = () => {
          addLog('error', 'WebSocket error. Is the backend running?');
        };
      } catch (error) {
        addLog('error', `Failed to connect: ${error.message}`);
      }
    };

    connectWebSocket();
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  const toggleLive = async () => {
    if (isLive) {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsLive(false);
      addLog('system', 'Camera stopped');
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false,
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsLive(true);
        addLog('system', 'Camera started — Visual feed active');
      } catch (error) {
        addLog('error', `Camera access denied: ${error.message}`);
      }
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  // Auto-send frame every 3s while live + connected
  useEffect(() => {
    if (!isLive || !isConnected) return;
    const interval = setInterval(() => {
      const frame = captureFrame();
      if (frame && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'image',
          data: frame.split(',')[1],
          mime_type: 'image/jpeg',
        }));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive, isConnected]);

  const sendMessage = async () => {
    if (!inputText.trim() || !isConnected || isSending) return;
    setIsSending(true);
    addLog('user', inputText);
    try {
      if (isLive) {
        const frame = captureFrame();
        if (frame) {
          wsRef.current.send(JSON.stringify({
            type: 'image',
            data: frame.split(',')[1],
            mime_type: 'image/jpeg',
          }));
        }
      }
      wsRef.current.send(JSON.stringify({ type: 'text', text: inputText }));
      setInputText('');
    } catch (error) {
      addLog('error', `Failed to send: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-hephaestus-dark text-white min-h-screen p-10">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Header */}
      <header className="flex justify-between items-center bg-hephaestus-panel p-5 rounded-3xl border border-gray-800 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-hephaestus-orange p-3 rounded-xl">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              HEPHAESTUS <span className="text-hephaestus-orange">v1.0</span>
            </h1>
            <p className="text-sm text-gray-400">
              {isConnected
                ? <span className="text-green-400">● Connected</span>
                : <span className="text-red-400">● Disconnected</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted(m => !m)}
            className={`p-3 rounded-xl border transition ${
              isMuted
                ? 'border-red-600 bg-red-600/20 text-red-400'
                : isAudioPlaying
                  ? 'border-green-500 bg-green-500/20 text-green-400 animate-pulse'
                  : 'border-gray-700 bg-gray-800 text-gray-400'
            }`}
            title={isMuted ? 'Unmute AI voice' : 'Mute AI voice'}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
            Export Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Camera Panel */}
        <div className="w-[450px]">
          <div className="bg-gray-900 aspect-square rounded-[40px] overflow-hidden border border-gray-800 flex items-center justify-center relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isLive ? 'block' : 'hidden'}`}
            />
            {!isLive && (
              <div className="text-center">
                <Camera size={64} className="mx-auto mb-4 text-gray-600" />
                <p className="text-gray-500 text-lg">CAMERA OFFLINE</p>
              </div>
            )}
            {isLive && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span className="text-xs text-green-400 font-bold">LIVE</span>
              </div>
            )}
            {/* Audio playing indicator */}
            {isAudioPlaying && !isMuted && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-full">
                <Volume2 size={14} className="text-hephaestus-orange animate-pulse" />
                <span className="text-xs text-hephaestus-orange font-bold">SPEAKING</span>
              </div>
            )}
          </div>

          <button
            onClick={toggleLive}
            className={`w-20 h-20 rounded-[25px] border-none cursor-pointer mx-auto mt-6 flex items-center justify-center transition-all ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-hephaestus-orange hover:bg-orange-700'
            }`}
          >
            {isLive
              ? <Square size={32} fill="white" color="white" />
              : <Play size={32} fill="white" color="white" className="ml-1" />}
          </button>
        </div>

        {/* Workspace Logs */}
        <div className="flex-1 bg-hephaestus-panel rounded-[40px] p-8 border border-gray-800 flex flex-col">
          <h2 className="flex items-center gap-3 text-xl font-bold mb-6">
            <Zap color="#f97316" size={24} />
            WORKSPACE LOGS
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3 mb-6 max-h-[500px]">
            {logs.length === 0 ? (
              <div className="bg-gray-800 p-4 rounded-2xl text-gray-400">
                [SYSTEM] Waiting for connection...
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl ${
                    log.type === 'system' ? 'bg-gray-800 text-gray-300' :
                    log.type === 'user'   ? 'bg-blue-900/30 text-blue-200' :
                    log.type === 'agent'  ? 'bg-orange-900/30 text-orange-200' :
                    'bg-red-900/30 text-red-200'
                  }`}
                >
                  <span className="text-xs text-gray-500">[{log.timestamp}]</span>
                  <span className="ml-2 font-semibold">[{log.type.toUpperCase()}]</span>
                  <p className="mt-1">{log.message}</p>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Hephaestus anything..."
              className="flex-1 bg-gray-800 text-white px-6 py-4 rounded-2xl border border-gray-700 focus:outline-none focus:border-hephaestus-orange transition"
              disabled={!isConnected || isSending}
            />
            <button
              onClick={sendMessage}
              disabled={!isConnected || !inputText.trim() || isSending}
              className="bg-hephaestus-orange px-6 py-4 rounded-2xl hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
