# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

Please report security vulnerabilities to **samo.hossam@gmail.com**.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a detailed response within 7 days
- We will work with you to understand and validate the issue
- We will develop and test a fix
- We will release a security advisory and patched version

## Security Best Practices

When using Hephaestus:

1. **Never commit your `.env` file** with API keys to version control
2. **Use HTTPS/WSS** in production, not HTTP/WS
3. **Implement rate limiting** on your deployment
4. **Keep dependencies updated** regularly
5. **Review camera/microphone permissions** in your browser
6. **Don't share sensitive information** through the camera feed
7. **Use strong authentication** if deploying publicly

## Known Security Considerations

### API Key Security

- The GEMINI_API_KEY is stored server-side only
- Never expose API keys in frontend code
- Rotate keys regularly
- Use separate keys for dev/staging/production

### WebSocket Security

- WebSocket connections are not authenticated in alpha version
- Plan to add authentication in Phase D (Production)
- Use WSS (WebSocket Secure) in production

### Privacy

- Camera frames are sent to Google Gemini API
- No frames are stored by Hephaestus by default
- Review Google's privacy policy for Gemini API
- Be mindful of what you show to the camera

## Updates

This security policy may be updated from time to time. Please check back regularly.
