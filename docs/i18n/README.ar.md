# هيفايستوس: مساعد الذكاء الاصطناعي المرئي المباشر 🛠️

> للقراءة باللغة العربية — هذه النسخة قيد التطوير. للتوثيق الكاملة الآن، يُرجى مراجعة [README الإنجليزية](../../README.md).

---

## ما هو هيفايستوس？

هيفايستوس هو وكيل ذكاء اصطناعي متعدد الوسائط مدعوم بـ **Google Gemini 2.5 Flash Native Audio**.
يتصل بالكاميرا في الوقت الفعلي، ويرد على أسئلتك بصوت مباشر.

## الميزات الرئيسية

- **مراقبة مرئية مباشرة**: تحليل مجال عملك عبر الكاميرا
- **رد صوتي**: تشغيل PCM مباشر في المتصفح
- **وصلة WebSocket ثابتة**: إعادة اتصال تلقائي
- **فلترة أجزاء التفكير**: لا يظهر التفكير الداخلي للنموذج

## البدء السريع

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# Backend
cd backend && pip install -r requirements.txt
cp .env.example .env  # أضف GEMINI_API_KEY
python main.py

# Frontend
cd ../frontend && npm install && npm run dev
```

افتح `http://localhost:5173`، اضغط على زر التشغيل، وابدأ المحادثة.

---

[عودة إلى README الإنجليزي](../../README.md)
