import React, { useState, useRef } from 'react';
import { Mic, Video, Play, Square, Cpu, Zap, ShieldCheck } from 'lucide-react';

const App = () => {
const [isLive, setIsLive] = useState(false);
const videoRef = useRef(null);

const toggleLive = async () => {
if (isLive) {
videoRef.current.srcObject.getTracks().forEach(t => t.stop());
setIsLive(false);
return;
}
const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
videoRef.current.srcObject = stream;
setIsLive(true);
};

return (
<div style={{ backgroundColor: '#020205', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
<header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0a0a12', padding: '20px', borderRadius: '20px', border: '1px solid #222' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
<div style={{ backgroundColor: '#ea580c', padding: '10px', borderRadius: '12px' }}><Cpu /></div>
<h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>HEPHAESTUS <span style={{ color: '#ea580c' }}>v1.0</span></h1>
</div>
<button style={{ backgroundColor: 'white', color: 'black', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', border: 'none' }}>Export Project</button>
</header>

  <div style={{ display: 'flex', gap: '30px', marginTop: '30px' }}>
    <div style={{ width: '400px' }}>
      <div style={{ backgroundColor: '#111', aspectRatio: '1/1', borderRadius: '30px', overflow: 'hidden', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectCover: 'cover', display: isLive ? 'block' : 'none' }} />
        {!isLive && <p style={{ color: '#444' }}>CAMERA OFFLINE</p>}
      </div>
      <button onClick={toggleLive} style={{ width: '80px', height: '80px', borderRadius: '25px', backgroundColor: isLive ? '#dc2626' : '#ea580c', border: 'none', cursor: 'pointer', margin: '20px auto', display: 'block' }}>
        {isLive ? <Square color="white" fill="white" /> : <Play color="white" fill="white" />}
      </button>
    </div>

    <div style={{ flex: 1, backgroundColor: '#0a0a12', borderRadius: '30px', padding: '30px', border: '1px solid #222' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Zap color="#f97316" /> WORKSPACE LOGS</h2>
      <div style={{ marginTop: '20px', color: '#888' }}>
        <p style={{ backgroundColor: '#1a1a2e', padding: '15px', borderRadius: '15px', marginBottom: '10px' }}>[SYSTEM] Waiting for Gemini Live connection...</p>
        {isLive && <p style={{ backgroundColor: '#ea580c22', color: '#fdba74', padding: '15px', borderRadius: '15px' }}>[AGENT] I am watching. Show me your hardware sketch.</p>}
      </div>
    </div>
  </div>
</div>
);
};
export default App;