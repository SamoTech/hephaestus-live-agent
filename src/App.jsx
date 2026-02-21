import React, { useState, useRef, useEffect } from 'react';
import { Mic, Video, Play, Square, Cpu, Zap, Send, Camera } from 'lucide-react';

const App = () => {
  const [isLive, setIsLive] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
    
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket(wsUrl);
        
        wsRef.current.onopen = () => {
          setIsConnected(true);
          addLog('system', 'Connected to Hephaestus AI Backend');
        };
        
        wsRef.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'system') {
            addLog('system', data.message);
          } else if (data.type === 'response') {
            addLog('agent', data.text);
          } else if (data.error) {
            addLog('error', `Error: ${data.error}`);
          }
        };
        
        wsRef.current.onclose = () => {
          setIsConnected(false);
          addLog('system', 'Disconnected from backend. Attempting to reconnect...');
          setTimeout(connectWebSocket, 3000);
        };
        
        wsRef.current.onerror = (error) => {
          addLog('error', 'WebSocket connection error. Check if backend is running.');
        };
      } catch (error) {
        addLog('error', `Failed to connect: ${error.message}`);
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const addLog = (type, message) => {
    setLogs(prev => [...prev, { type, message, timestamp: new Date().toLocaleTimeString() }]);
  };

  const toggleLive = async () => {
    if (isLive) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsLive(false);
      addLog('system', 'Camera stopped');
    } else {
      // Start camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720 }, 
          audio: false 
        });
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsLive(true);
        addLog('system', 'Camera started - Ready for visual assistance');
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
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !isConnected || isSending) return;
    
    setIsSending(true);
    addLog('user', inputText);
    
    try {
      const message = {
        type: isLive ? 'video_frame' : 'text',
        text: inputText,
      };
      
      if (isLive) {
        const frame = captureFrame();
        if (frame) {
          message.frame = frame;
        }
      }
      
      wsRef.current.send(JSON.stringify(message));
      setInputText('');
    } catch (error) {
      addLog('error', `Failed to send message: ${error.message}`);
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
      {/* Hidden canvas for frame capture */}
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
              {isConnected ? (
                <span className="text-green-400">• Connected</span>
              ) : (
                <span className="text-red-400">• Disconnected</span>
              )}
            </p>
          </div>
        </div>
        <button className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
          Export Project
        </button>
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
          </div>
          
          {/* Camera Control Button */}
          <button 
            onClick={toggleLive}
            className={`w-20 h-20 rounded-[25px] border-none cursor-pointer mx-auto mt-6 block transition-all ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-hephaestus-orange hover:bg-orange-700'
            }`}
          >
            {isLive ? (
              <Square size={32} className="mx-auto" fill="white" color="white" />
            ) : (
              <Play size={32} className="mx-auto ml-1" fill="white" color="white" />
            )}
          </button>
        </div>

        {/* Workspace Logs */}
        <div className="flex-1 bg-hephaestus-panel rounded-[40px] p-8 border border-gray-800 flex flex-col">
          <h2 className="flex items-center gap-3 text-xl font-bold mb-6">
            <Zap color="#f97316" size={24} /> 
            WORKSPACE LOGS
          </h2>
          
          {/* Logs Area */}
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
                    log.type === 'user' ? 'bg-blue-900/30 text-blue-200' :
                    log.type === 'agent' ? 'bg-orange-900/30 text-orange-200' :
                    'bg-red-900/30 text-red-200'
                  }`}
                >
                  <span className="text-xs text-gray-500">[{log.timestamp}]</span>
                  <span className="ml-2 font-semibold">
                    [{log.type.toUpperCase()}]
                  </span>
                  <p className="mt-1">{log.message}</p>
                </div>
              ))
            )}
          </div>
          
          {/* Input Area */}
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