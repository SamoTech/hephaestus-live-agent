# Contributing to Hephaestus

Thank you for your interest in contributing to Hephaestus! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful, inclusive, and constructive. We're building this together!

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
1. Check existing [Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)
2. Verify it's actually a bug and not a setup issue
3. Try to reproduce it with the latest version

**When submitting:**
- Use a clear, descriptive title
- Describe exact steps to reproduce
- Include screenshots/videos if relevant
- Mention your OS, browser, and versions
- Include error messages from console

### Suggesting Features

- Search [Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions) first
- Explain the problem your feature would solve
- Describe how it would work
- Consider edge cases and alternatives

### Code Contributions

## Development Setup

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hephaestus-live-agent.git
   cd hephaestus-live-agent
   ```
3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies** (see [SETUP.md](SETUP.md))

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **ESLint** rules (run `npm run lint`)
- Use **meaningful variable names**
- Keep components **small and focused**
- Add **comments** for complex logic

### Python

- Follow **PEP 8** style guide
- Use **type hints** where appropriate
- Write **docstrings** for functions/classes
- Keep functions **small and focused**
- Use **async/await** for I/O operations

### Commits

Use conventional commit messages:

```
type(scope): subject

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(backend): add support for audio input
fix(frontend): resolve camera permission issue on Safari
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes**
   - Write clean, documented code
   - Test thoroughly
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the template:
     - **Description**: What does this PR do?
     - **Related Issue**: Link to issue if applicable
     - **Testing**: How did you test it?
     - **Screenshots**: If UI changes

6. **Wait for review**
   - Maintainers will review your code
   - Address any requested changes
   - Once approved, it will be merged!

## Project Structure

```
hephaestus-live-agent/
├── src/                  # Frontend React code
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── main.py              # Backend FastAPI server
├── package.json         # Node.js dependencies
├── requirements.txt     # Python dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
└── .env.example         # Environment variables template
```

## Areas to Contribute

### High Priority
- 🔴 **Testing**: Unit tests, integration tests
- 🔴 **Documentation**: Tutorials, examples, API docs
- 🔴 **Bug fixes**: Check [Issues](https://github.com/SamoTech/hephaestus-live-agent/issues)

### Features to Build
- 🟡 Voice input/output
- 🟡 Session recording/replay
- 🟡 Multi-language support
- 🟡 Mobile app version
- 🟡 Plugin system

### Good First Issues

Look for issues labeled `good-first-issue` - they're designed for newcomers!

## Testing

### Manual Testing

1. Test with camera on/off
2. Test text-only interactions
3. Test visual interactions (show objects, sketches)
4. Test error scenarios (disconnect backend, deny camera)
5. Test on different browsers

### Future: Automated Testing

We plan to add:
- Jest for frontend unit tests
- Pytest for backend tests
- Playwright for e2e tests

## Documentation

Good documentation is as important as code:

- **README.md**: High-level overview
- **SETUP.md**: Installation guide
- **CONTRIBUTING.md**: This file
- **Code comments**: Explain complex logic
- **Inline docs**: JSDoc, Python docstrings

## Questions?

- **Technical questions**: [GitHub Discussions](https://github.com/SamoTech/hephaestus-live-agent/discussions)
- **Chat**: Coming soon!
- **Email**: [samo.hossam@gmail.com](mailto:samo.hossam@gmail.com)

## Recognition

All contributors will be:
- ✨ Listed in README contributors section
- 🎉 Mentioned in release notes
- ❤️ Appreciated forever!

Thank you for making Hephaestus better! 🚀