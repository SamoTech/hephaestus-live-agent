# Hephaestus: Реальновременный ИИ-визуальный ассистент 🛠️

> Это русский перевод, который находится в разработке. Полная документация доступна в [README на английском](../../README.md).

---

## Что такое Hephaestus?

Hephaestus — это мультимодальный ИИ-агент реального времени на базе **Google Gemini 2.5 Flash Native Audio**.
Он наблюдает за вашей рабочей областью через камеру и отвечает голосом прямо в браузере.

## Основные возможности

- **Трансляция камеры в реальном времени**: JPEG-кадры каждые 3 секунды
- **Голосовой ответ**: воспроизведение PCM-аудио в браузере
- **Стабильное WebSocket-соединение**: автоматическое переподключение
- **Фильтрация мыслей**: внутренние размышления модели скрыты

## Быстрый старт

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# Бэкенд
cd backend && pip install -r requirements.txt
cp .env.example .env  # Укажите GEMINI_API_KEY
python main.py

# Фронтенд
cd ../frontend && npm install && npm run dev
```

Откройте `http://localhost:5173`, нажмите оранжевую кнопку и начните чат.

---

[Вернуться к README на английском](../../README.md)
