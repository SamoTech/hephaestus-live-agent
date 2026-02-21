# Deployment Guide

## Development Deployment

### Local Setup

See [Quick Start](../README.md#quick-start) in README.

### Using Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. **Set environment variables**:

```bash
# Create .env file
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

2. **Start services**:

```bash
docker-compose up -d
```

3. **View logs**:

```bash
docker-compose logs -f
```

4. **Stop services**:

```bash
docker-compose down
```

### Manual Docker Build

#### Backend

```bash
cd backend
docker build -t hephaestus-backend .
docker run -p 8000:8000 -e GEMINI_API_KEY=your_key hephaestus-backend
```

#### Frontend

```bash
cd frontend
docker build -t hephaestus-frontend .
docker run -p 5173:5173 hephaestus-frontend
```

## Production Deployment

### Cloud Platforms

#### AWS (Elastic Beanstalk)

1. **Install EB CLI**:

```bash
pip install awsebcli
```

2. **Initialize**:

```bash
eb init -p docker hephaestus-backend
```

3. **Create environment**:

```bash
eb create hephaestus-prod
```

4. **Deploy**:

```bash
eb deploy
```

#### Google Cloud Platform (Cloud Run)

1. **Build and push**:

```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/hephaestus-backend
```

2. **Deploy**:

```bash
gcloud run deploy hephaestus-backend \
  --image gcr.io/PROJECT_ID/hephaestus-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Heroku

1. **Create app**:

```bash
heroku create hephaestus-backend
```

2. **Set buildpack**:

```bash
heroku buildpacks:set heroku/python
```

3. **Deploy**:

```bash
git push heroku main
```

### Kubernetes (Phase D)

#### Setup

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hephaestus-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hephaestus-backend
  template:
    metadata:
      labels:
        app: hephaestus-backend
    spec:
      containers:
      - name: backend
        image: samotech/hephaestus-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: hephaestus-secrets
              key: gemini-api-key
```

#### Apply

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
```

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | - | Google Gemini API key |
| `HOST` | No | `0.0.0.0` | Server host |
| `PORT` | No | `8000` | Server port |
| `LOG_LEVEL` | No | `INFO` | Logging level |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |

### Frontend

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_WS_URL` | No | `ws://localhost:8000/ws/live` | WebSocket URL |
| `VITE_API_URL` | No | `http://localhost:8000` | API base URL |

## SSL/TLS Configuration

### NGINX Reverse Proxy

```nginx
server {
    listen 443 ssl http2;
    server_name hephaestus.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # WebSocket proxy
    location /ws/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend
    location / {
        proxy_pass http://frontend:5173;
        proxy_set_header Host $host;
    }
}
```

## Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8000/

# WebSocket test
wscat -c ws://localhost:8000/ws/live
```

### Logging

```bash
# Docker logs
docker-compose logs -f backend

# Application logs (when running directly)
tail -f backend/logs/app.log
```

## Troubleshooting

### Common Issues

**"Connection refused" on port 8000**
- Check if backend is running
- Verify firewall rules
- Check Docker network configuration

**"WebSocket connection failed"**
- Ensure WebSocket route is configured
- Check CORS settings
- Verify SSL/TLS certificates for WSS

**"Invalid API key"**
- Verify GEMINI_API_KEY is set correctly
- Check key hasn't expired
- Ensure no extra spaces in .env file

## Performance Tuning

### Backend

```python
# main.py
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        workers=4,  # CPU cores
        ws_ping_interval=20,
        ws_ping_timeout=20,
    )
```

### NGINX

```nginx
worker_processes auto;
worker_connections 1024;

keepalive_timeout 65;
keepalive_requests 100;
```

## Backup and Recovery

### Session Data (Phase D)

```bash
# Backup Redis
redis-cli --rdb /backup/dump.rdb

# Restore
cp /backup/dump.rdb /var/lib/redis/dump.rdb
systemctl restart redis
```

## Scaling

### Horizontal Scaling

```bash
# Docker Compose
docker-compose up --scale backend=3

# Kubernetes
kubectl scale deployment hephaestus-backend --replicas=5
```

### Load Balancing

Use NGINX, HAProxy, or cloud load balancers for distributing traffic across multiple backend instances.
