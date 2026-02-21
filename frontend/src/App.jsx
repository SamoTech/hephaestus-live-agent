import React, { useState, useRef, useEffect } from 'react';
import { Mic, Video, Play, Square, Cpu, Zap, ShieldCheck, Send } from 'lucide-react';

const App = () => {
  const [isLive, setIsLive] = useState(false);
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [userInput, setUserInput] = useState("");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const appendLog = (entry) => {
    setLogs(prev => [...prev, { text: entry, time: new Date().toLocaleTimeString() }]);
  };

  const startWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8000/ws/live");
    
    ws.onopen = () => {
      appendLog("[SYSTEM] Connected to Hephaestus backend");
    };
    
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "model_text") {
          appendLog(`[AGENT] ${msg.text}`);
        } else if (msg.type === "system") {
          appendLog(`[SYSTEM] ${msg.text}`);
        } else if (msg.type === "error") {
          appendLog(`[ERROR] ${msg.text}`);
        }
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    };
    
    ws.onclose = () => {
      appendLog("[SYSTEM] Connection closed");
    };
    
    ws.onerror = (error) => {
      appendLog("[ERROR] WebSocket error - is backend running?");
      console.error("WebSocket error:", error);
    };
    
    setSocket(ws);
  };

  const stopWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  const toggleLive = async () => {
    if (isLive) {
      // Stop camera and websocket
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      stopWebSocket();
      setIsLive(false);
      return;
    }
    
    try {
      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false  // Phase A: no audio yet
      });
      videoRef.current.srcObject = stream;
      setIsLive(true);
      
      // Start websocket
      startWebSocket();
    } catch (error) {
      appendLog("[ERROR] Failed to access camera. Please grant permissions.");
      console.error("Camera error:", error);
    }
  };

  const sendText = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      appendLog("[ERROR] Not connected to backend");
      return;
    }
    if (!userInput.trim()) return;
    
    socket.send(JSON.stringify({
      type: "text",
      text: userInput.trim()
    }));
    appendLog(`[YOU] ${userInput.trim()}`);
    setUserInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendText();
    }
  };

  // Capture and send frames periodically when live
  useEffect(() => {
    if (!isLive || !socket || socket.readyState !== WebSocket.OPEN) return;
    
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob || socket.readyState !== WebSocket.OPEN) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          socket.send(JSON.stringify({
            type: "image",
            data: base64,
            mime_type: blob.type
          }));
        };
        reader.readAsDataURL(blob);
      }, 'image/jpeg', 0.7);
    }, 3000); // Send frame every 3 seconds
    
    return () => clearInterval(interval);
  }, [isLive, socket]);

  return (
    <div style={{ backgroundColor: '#020205', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a12', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#ea580c', padding: '10px', borderRadius: '12px' }}><Cpu /></div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>HEPHAESTUS <span style={{ color: '#ea580c' }}>v1.0</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ 
            backgroundColor: isLive ? '#22c55e' : '#666', 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }} />
          <span style={{ fontSize: '14px', color: '#888' }}>
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
        {/* Camera Panel */}
        <div style={{ width: '400px' }}>
          <div style={{ backgroundColor: '#111', aspectRatio: '4/3', borderRadius: '30px', overflow: 'hidden', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', display: isLive ? 'block' : 'none' }} />
            {!isLive && (
              <div style={{ textAlign: 'center' }}>
                <Video size={48} color="#444" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#444' }}>CAMERA OFFLINE</p>
              </div>
            )}
          </div>
          <button 
            onClick={toggleLive} 
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '25px', 
              backgroundColor: isLive ? '#dc2626' : '#ea580c', 
              border: 'none', 
              cursor: 'pointer', 
              margin: '20px auto', 
              display: 'block',
              transition: 'all 0.3s'
            }}
          >
            {isLive ? <Square color="white" fill="white" /> : <Play color="white" fill="white" />}
          </button>
        </div>

        {/* Workspace Panel */}
        <div style={{ flex: 1, backgroundColor: '#0a0a12', borderRadius: '30px', padding: '30px', border: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Zap color="#f97316" /> WORKSPACE LOGS
          </h2>
          
          {/* Logs Display */}
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            marginBottom: '20px',
            maxHeight: '400px'
          }}>
            {logs.length === 0 ? (
              <p style={{ backgroundColor: '#1a1a2e', padding: '15px', borderRadius: '15px', color: '#888' }}>
                [SYSTEM] Waiting for connection... Click the play button to start.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    backgroundColor: log.text.startsWith('[AGENT]') ? '#ea580c22' : '#1a1a2e',
                    color: log.text.startsWith('[AGENT]') ? '#fdba74' : log.text.startsWith('[ERROR]') ? '#ef4444' : '#888',
                    padding: '15px', 
                    borderRadius: '15px', 
                    marginBottom: '10px',
                    fontSize: '14px'
                  }}
                >
                  <span style={{ fontSize: '12px', opacity: 0.6, marginRight: '10px' }}>{log.time}</span>
                  {log.text}
                </div>
              ))
            )}
          </div>

          {/* Text Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask something or describe what you're showing..."
              disabled={!isLive}
              style={{
                flex: 1,
                backgroundColor: '#1a1a2e',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={sendText}
              disabled={!isLive || !userInput.trim()}
              style={{
                backgroundColor: isLive && userInput.trim() ? '#ea580c' : '#333',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                cursor: isLive && userInput.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={20} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Add pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default App;