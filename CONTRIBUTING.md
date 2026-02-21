# Contributing to Hephaestus

Thank you for your interest in contributing to Hephaestus! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Python version)

### Suggesting Features

1. Check [Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions) for similar ideas
2. Create a new discussion with:
   - Clear use case
   - Proposed solution
   - Alternative approaches considered
   - Mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following our coding standards
4. Write or update tests
5. Update documentation
6. Commit with conventional commits: `git commit -m "feat: add feature"`
7. Push to your fork: `git push origin feature/your-feature`
8. Open a Pull Request

## Development Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- Git

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hephaestus-live-agent.git
cd hephaestus-live-agent

# Run setup script
./scripts/setup.sh

# Backend
cd backend
source venv/bin/activate
python main.py

# Frontend (new terminal)
cd frontend
npm run dev
```

## Coding Standards

### Python (Backend)

- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters (Black default)
- Docstrings for all public functions
- Use `async/await` for I/O operations

```python
async def process_frame(frame: bytes) -> Dict[str, Any]:
    """
    Process a video frame and extract features.
    
    Args:
        frame: Raw frame bytes
    
    Returns:
        Dictionary containing frame analysis
    """
    # Implementation
    pass
```

### JavaScript/React (Frontend)

- Use ES6+ features
- Functional components with hooks
- PropTypes or TypeScript for type checking
- Maximum line length: 100 characters
- JSDoc comments for complex functions

```javascript
/**
 * Capture a frame from video element
 * @param {HTMLVideoElement} video - Video element
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<string>} Base64 encoded frame
 */
const captureFrame = async (video, quality = 0.7) => {
  // Implementation
};
```

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples

```
feat(audio): add microphone streaming support

Implement audio capture pipeline with PCM encoding.
Includes resampling to 16kHz and WebSocket transmission.

Closes #42
```

```
fix(backend): resolve WebSocket connection timeout

Increased connection timeout from 5s to 30s to handle
slow network conditions.

Fixes #56
```

## Testing

### Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Documentation

- Update README.md for user-facing changes
- Add docstrings/comments for code
- Update API.md for API changes
- Add examples for new features

## Review Process

1. Automated checks must pass (CI/CD)
2. At least one maintainer review required
3. All discussions must be resolved
4. Branch must be up to date with main

## Getting Help

- Join [Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
- Email: samo.hossam@gmail.com
- Twitter: [@OssamaHashim](https://x.com/OssamaHashim)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
