# Hephaestus: Echtzeit KI-Visuelassistent 🛠️

> Dies ist die deutsche Übersetzung, derzeit in Entwicklung. Vollständige Dokumentation findest du im [englischen README](../../README.md).

---

## Was ist Hephaestus?

Hephaestus ist ein multimodaler Echtzeit-KI-Agent, betrieben von **Google Gemini 2.5 Flash Native Audio**.
Er beobachtet deinen Arbeitsbereich über die Kamera und antwortet mit Sprache direkt im Browser.

## Hauptfunktionen

- **Live-Kamera-Streaming**: JPEG-Frames alle 3 Sekunden
- **Sprachausgabe**: PCM-Audio-Wiedergabe im Browser
- **Stabile WebSocket-Verbindung**: Automatische Wiederverbindung
- **Thought-Filterung**: Interne Modellüberlegungen werden ausgeblendet

## Schnellstart

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # GEMINI_API_KEY setzen
python main.py

# Frontend
cd ../frontend && npm install && npm run dev
```

Öffne `http://localhost:5173`, klicke auf den orangen Button und starte den Chat.

---

[Zurück zum englischen README](../../README.md)
