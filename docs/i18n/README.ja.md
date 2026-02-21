# Hephaestus: リアルタイム AI ビジュアルアシスタント 🛠️

> これは日本語版の翻訳で、現在開発中です。完全なドキュメントは [English README](../../README.md) を参照してください。

---

## Hephaestusとは？

Hephaestusは **Google Gemini 2.5 Flash Native Audio** を搭載したリアルタイムのマルチモーダル AI エージェントです。
カメラでワークスペースをリアルタイムに見ながら、ブラウザで直接音声で回答します。

## 主な機能

- **ライブカメラストリーミング**: 3秒ごとに JPEG フレームを送信
- **音声応答**: ブラウザで PCM オーディオを再生
- **安定した WebSocket 接続**: 自動再接続
- **思考フィルタリング**: モデル内部の推論は非表示

## クイックスタート

```bash
git clone https://github.com/SamoTech/hephaestus-live-agent.git
cd hephaestus-live-agent

# バックエンド
cd backend && pip install -r requirements.txt
cp .env.example .env  # GEMINI_API_KEY を設定
python main.py

# フロントエンド
cd ../frontend && npm install && npm run dev
```

`http://localhost:5173` を開き、オレンジのボタンをクリックしてチャットを始めましょう。

---

[English README に戻る](../../README.md)
