# Hephaestus API Documentation

## WebSocket API

### Endpoint

```
ws://localhost:8000/ws/live
```

### Connection

Establish a WebSocket connection to start a live session.

**Example (JavaScript)**:
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/live');

ws.onopen = () => {
  console.log('Connected to Hephaestus');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

## Message Format

### Client → Server Messages

#### 1. Text Message

Send a text query to the AI.

```json
{
  "type": "text",
  "text": "What do you see in the image?"
}
```

**Fields**:
- `type` (string, required): Must be `"text"`
- `text` (string, required): The text message

#### 2. Image Message

Send a camera frame or image for analysis.

```json
{
  "type": "image",
  "data": "base64_encoded_jpeg_data",
  "mime_type": "image/jpeg"
}
```

**Fields**:
- `type` (string, required): Must be `"image"`
- `data` (string, required): Base64-encoded image data
- `mime_type` (string, required): MIME type, typically `"image/jpeg"` or `"image/png"`

#### 3. Audio Message (Phase B)

Send audio data for speech recognition.

```json
{
  "type": "audio",
  "data": "base64_encoded_pcm_data",
  "mime_type": "audio/pcm;rate=16000"
}
```

**Fields**:
- `type` (string, required): Must be `"audio"`
- `data` (string, required): Base64-encoded PCM audio data
- `mime_type` (string, required): Must be `"audio/pcm;rate=16000"`

**Audio Requirements**:
- Format: 16-bit PCM
- Sample rate: 16000 Hz
- Channels: 1 (mono)
- Encoding: Little-endian

### Server → Client Messages

#### 1. Model Text Response

AI-generated text response.

```json
{
  "type": "model_text",
  "text": "I can see a breadboard with an LED circuit..."
}
```

**Fields**:
- `type` (string): Always `"model_text"`
- `text` (string): The AI response text

#### 2. System Message

System status or informational message.

```json
{
  "type": "system",
  "text": "Connected to Hephaestus AI. Camera feed active."
}
```

**Fields**:
- `type` (string): Always `"system"`
- `text` (string): System message

#### 3. Error Message

Error notification.

```json
{
  "type": "error",
  "text": "Backend error: Invalid API key"
}
```

**Fields**:
- `type` (string): Always `"error"`
- `text` (string): Error description

#### 4. Audio Response (Phase B - Planned)

AI-generated audio response.

```json
{
  "type": "audio",
  "data": "base64_encoded_pcm_data",
  "sample_rate": 24000
}
```

**Fields**:
- `type` (string): Always `"audio"`
- `data` (string): Base64-encoded PCM audio data
- `sample_rate` (number): Sample rate in Hz (typically 24000)

## REST API (Planned for Phase D)

### Health Check

```
GET /
```

**Response**:
```json
{
  "service": "Hephaestus Live Backend",
  "status": "running",
  "version": "1.0.0",
  "endpoints": {
    "websocket": "/ws/live"
  }
}
```

### Session Management (Future)

#### Create Session

```
POST /api/sessions
```

**Request**:
```json
{
  "user_id": "user123",
  "config": {
    "system_prompt": "custom prompt"
  }
}
```

**Response**:
```json
{
  "session_id": "sess_abc123",
  "ws_url": "ws://localhost:8000/ws/live/sess_abc123"
}
```

#### Get Session

```
GET /api/sessions/{session_id}
```

**Response**:
```json
{
  "session_id": "sess_abc123",
  "user_id": "user123",
  "created_at": "2026-02-21T10:00:00Z",
  "status": "active"
}
```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 1000 | Normal Closure | Clean disconnect |
| 1001 | Going Away | Server shutting down |
| 1003 | Unsupported Data | Invalid message format |
| 1008 | Policy Violation | Rate limit exceeded |
| 1011 | Internal Error | Server error |

## Rate Limits (Phase D)

- **Messages**: 60 per minute
- **Images**: 20 per minute
- **Audio**: Continuous streaming allowed
- **Connections**: 5 concurrent per user

## Examples

### Complete Session Example

```javascript
class HephaestusClient {
  constructor(url = 'ws://localhost:8000/ws/live') {
    this.ws = new WebSocket(url);
    this.setupHandlers();
  }

  setupHandlers() {
    this.ws.onopen = () => {
      console.log('Connected');
    };

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      this.handleMessage(msg);
    };

    this.ws.onerror = (error) => {
      console.error('Error:', error);
    };

    this.ws.onclose = () => {
      console.log('Disconnected');
    };
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'model_text':
        console.log('AI:', msg.text);
        break;
      case 'system':
        console.log('System:', msg.text);
        break;
      case 'error':
        console.error('Error:', msg.text);
        break;
    }
  }

  sendText(text) {
    this.ws.send(JSON.stringify({
      type: 'text',
      text: text
    }));
  }

  sendImage(base64Data, mimeType = 'image/jpeg') {
    this.ws.send(JSON.stringify({
      type: 'image',
      data: base64Data,
      mime_type: mimeType
    }));
  }

  close() {
    this.ws.close();
  }
}

// Usage
const client = new HephaestusClient();
client.sendText('Hello!');
```

### Frame Capture Example

```javascript
async function captureAndSendFrame(video, client) {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);
  
  canvas.toBlob((blob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1];
      client.sendImage(base64, blob.type);
    };
    reader.readAsDataURL(blob);
  }, 'image/jpeg', 0.7);
}
```

## SDK (Future)

Planned official SDKs:

- **JavaScript/TypeScript**: `@hephaestus/client`
- **Python**: `hephaestus-client`
- **React**: `@hephaestus/react`
- **React Native**: `@hephaestus/react-native`
