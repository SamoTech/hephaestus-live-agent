# Hephaestus: Asistente Visual de IA en Tiempo Real 🛠️

> Esta es la traducción al español, actualmente en desarrollo. Para documentación completa, consulta el [README en inglés](../../README.md).

---

## ¿Qué es Hephaestus?

Hephaestus es un agente de IA multimodal en tiempo real impulsado por **Google Gemini 2.5 Flash Native Audio**.
Observa tu espacio de trabajo a través de la cámara y responde con voz en vivo, directamente en el navegador.

## Características Principales

- **Transmisión de cámara en vivo**: Fotogramas JPEG cada 3 segundos
- **Respuesta de voz**: Reproducción de audio PCM en el navegador
- **Conexión WebSocket estable**: Reconexión automática
- **Filtrado de pensamientos**: Los razonamientos internos del modelo no se muestran

## Inicio Rápido

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # Agrega GEMINI_API_KEY
python main.py

# Frontend
cd ../frontend && npm install && npm run dev
```

Abre `http://localhost:5173`, pulsa el botón naranja y empieza a chatear.

---

[Volver al README en inglés](../../README.md)
