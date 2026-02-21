# Hephaestus: Assistant Visuel IA en Temps Réel 🛠️

> Ceci est la traduction française, en cours de développement. Pour la documentation complète, consultez le [README en anglais](../../README.md).

---

## Qu'est-ce que Hephaestus?

Hephaestus est un agent IA multimodal en temps réel propulsé par **Google Gemini 2.5 Flash Native Audio**.
Il observe votre espace de travail via la caméra et répond à voix haute, directement dans le navigateur.

## Fonctionnalités Principales

- **Flux caméra en direct**: Images JPEG toutes les 3 secondes
- **Réponse vocale**: Lecture audio PCM dans le navigateur
- **Connexion WebSocket stable**: Reconnexion automatique
- **Filtrage des pensées**: Le raisonnement interne du modèle est masqué

## Démarrage Rapide

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # Ajoutez GEMINI_API_KEY
python main.py

# Frontend
cd ../frontend && npm install && npm run dev
```

Ouvrez `http://localhost:5173`, cliquez sur le bouton orange et commencez à discuter.

---

[Retour au README anglais](../../README.md)
