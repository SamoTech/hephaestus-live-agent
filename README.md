Hephaestus: The Engineering Architect 🛠️

Multimodal AI Agent for Real-Time Engineering Support

🌐 Language Navigation / التنقل بين اللغات

English | العربية | Español | 中文 | Français

<a name="english"></a>

🇺🇸 English

Hephaestus is a cutting-edge multimodal AI agent designed to bridge the gap between physical engineering and digital design. Using Gemini 2.5 Flash, it observes your workspace via camera to provide real-time guidance, code generation, and hardware analysis.

✨ Key Features

👁️ Live Vision Awareness: Sees and understands your physical sketches and circuits in real-time.

🤖 Agentic Tools: Automatically searches for component datasheets and saves code to your local machine.

⚡ Low Latency: Optimized for near-instant voice and visual interaction using WebSockets.

📜 Interleaved Output: Seamlessly mixes text, generated code snippets, and audio responses.

🚀 Quick Start

Clone the Repo:

git clone [https://github.com/SamoTech/hephaestus-live-agent.git](https://github.com/SamoTech/hephaestus-live-agent.git)


Install Dependencies:

npm install && pip install google-genai


Environment Setup: Create a .env file and add your GEMINI_API_KEY.

Launch: Run npm run dev and python main.py.

<a name="arabic"></a>

🇪🇬 العربية

هيفايستوس (Hephaestus) هو وكيل ذكاء اصطناعي متطور متعدد الوسائط، صُمم لربط الهندسة الفيزيائية بالتصميم الرقمي. يعتمد على نموذج Gemini 2.5 Flash لمراقبة بيئة عملك عبر الكاميرا وتقديم توجيهات فورية، توليد أكواد برمجية، وتحليل المكونات الصلبة.

✨ المميزات الرئيسية

👁️ الوعي البصري الحي: يرى ويحلل المخططات اليدوية والدوائر الكهربائية بشكل مباشر.

🤖 أدوات الوكيل الذكي: يبحث تلقائياً عن مواصفات القطع (Datasheets) ويحفظ الأكواد المولدة.

⚡ استجابة فائقة السرعة: زمن استجابة منخفض جداً لضمان تفاعل صوتي وبصري طبيعي.

📜 مخرجات متداخلة: يدمج بين النصوص، الأكواد البرمجية، والردود الصوتية في تدفق واحد.

<a name="espanol"></a>

🇪🇸 Español

Hephaestus es un agente de IA multimodal de vanguardia diseñado para cerrar la brecha entre la ingeniería física y el diseño digital. Utiliza Gemini 2.5 Flash para observar su espacio de trabajo y proporcionar orientación en tiempo real.

✨ Características Principales

Conciencia Visual: Entiende sus bocetos físicos y circuitos.

Herramientas Agénticas: Busca hojas de datos de componentes y guarda código automáticamente.

<a name="chinese"></a>

🇨🇳 中文

Hephaestus 是一款尖端的多模态人工智能代理，旨在弥合物理工程与数字设计之间的鸿沟。它利用 Gemini 2.5 Flash 通过摄像头观察您的工作空间，提供实时指导、代码生成和硬件分析。

✨ 主要功能

实时视觉感知： 识别并理解您的手绘草图和电路。

代理工具： 自动搜索组件数据表并保存代码。

<a name="francais"></a>

🇫🇷 Français

Hephaestus est un agent d'IA multimodal de pointe conçu pour combler le fossé entre l'ingénierie physique et la conception numérique. Il utilise Gemini 2.5 Flash pour observer votre espace de travail et fournir des conseils en tiempo réel.

✨ Caractéristiques Principales

Conscience Visuelle: Voit et comprend vos croquis physiques et vos circuits.

Outils Agentiques: Recherche automatiquement les fiches techniques des composants.

🛠️ Tech Stack / التقنيات المستخدمة

Layer

Technology

Status

AI Brain

Google Gemini 2.5 Flash

✅ Active

Frontend

React.js + Tailwind CSS

✅ Active

Backend

Python + Google GenAI SDK

✅ Active

Real-time

WebSockets / WebRTC

✅ Active

Icons

Lucide-React

✅ Active

🚀 What's Next? / ماذا بعد؟

1. Cloud Integration (Storage) ☁️

We plan to add Firestore integration to allow users to save their project history, generated codes, and component snapshots across different devices.

2. Multi-User Collaboration 👥

Enable multiple engineers to view the same "Live Stream" and collaborate on the same workspace remotely with shared logs.

3. Advanced Hardware Simulation 🔬

Integration with CAD software and circuit simulators (like LTspice) to test generated designs before physical assembly.

🤝 Contributing

Contributions are welcome! If you'd like to improve Hephaestus, please:

Fork the Project.

Create your Feature Branch (git checkout -b feature/AmazingFeature).

Commit your Changes (git commit -m 'Add some AmazingFeature').

Push to the Branch (git push origin feature/AmazingFeature).

Open a Pull Request.

Created by SamoTech - Building the future of AI Engineering.
