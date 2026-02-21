# Backend Configuration

This directory contains configuration files for the Hephaestus backend.

## Files

### `settings.py`

Application-wide settings and environment variables.

**Usage**:
```python
from config.settings import GEMINI_API_KEY, HOST, PORT

print(f"Starting on {HOST}:{PORT}")
```

### `prompts.py`

System prompts for different use cases (engineering, education, creative, etc.).

**Usage**:
```python
from config.prompts import get_prompt

system_instruction = get_prompt("engineering")
```

## Environment Variables

All settings can be overridden via environment variables. See `settings.py` for defaults.

### Required

- `GEMINI_API_KEY`: Your Google Gemini API key

### Optional

- `HOST`: Server host (default: `0.0.0.0`)
- `PORT`: Server port (default: `8000`)
- `LOG_LEVEL`: Logging level (default: `INFO`)
- `GEMINI_MODEL`: Gemini model to use (default: `gemini-2.0-flash-exp`)
- `CORS_ORIGINS`: Comma-separated list of allowed origins

## Customization

### Adding New Prompts

Edit `prompts.py`:

```python
CUSTOM_PROMPT = "Your custom prompt here..."

PROMPTS = {
    # ... existing prompts
    "custom": CUSTOM_PROMPT,
}
```

Use in code:

```python
system_instruction = get_prompt("custom")
```

### Modifying Settings

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_key
LOG_LEVEL=DEBUG
PORT=8080
```

Or set environment variables directly:

```bash
export GEMINI_API_KEY=your_key
export LOG_LEVEL=DEBUG
python main.py
```
