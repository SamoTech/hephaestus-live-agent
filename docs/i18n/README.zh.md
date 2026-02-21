# Hephaestus: 实时 AI 视觉助手 🛠️

> 这是中文翻译版本，正在建设中。完整文档请参阅 [英文 README](../../README.md)。

---

## Hephaestus 是什么？

Hephaestus 是由 **Google Gemini 2.5 Flash Native Audio** 驱动的实时多模态 AI 助手。它通过摄像头实时观察您的工作区域，并直接在浏览器中播放语音回复。

## 主要功能

- **实时摄像头视频流**: 每 3 秒自动发送 JPEG 帧
- **语音回复**: 在浏览器中直接播放 PCM 音频
- **稳定的 WebSocket 连接**: 自动重连
- **思维部分过滤**: 不显示模型内部推理

## 快速开始

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# 后端
cd backend && pip install -r requirements.txt
cp .env.example .env  # 设置 GEMINI_API_KEY
python main.py

# 前端
cd ../frontend && npm install && npm run dev
```

打开 `http://localhost:5173`，点击橙色按鈕启动摄像头，然后输入消息。

---

[返回英文 README](../../README.md)
