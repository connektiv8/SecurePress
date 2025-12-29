# Contributing to SecurePress

> Thank you for your interest in contributing to SecurePress!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - System information

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear use case
   - Proposed solution
   - Alternative considerations

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Clear description of changes
   - Link related issues
   - Ensure CI passes

## Development Setup

```bash
# Clone repository
git clone https://github.com/connektiv8/SecurePress.git
cd SecurePress

# Install development environment
./install.sh

# Run tests
make test
```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Maximum line length: 100
- Use Ruff for linting

### TypeScript
- Use ESLint configuration
- Strict type checking
- Functional components with hooks

### Git Commits
- Use conventional commits
- Format: `type(scope): message`
- Types: feat, fix, docs, style, refactor, test, chore

## Testing

- Write tests for new features
- Maintain > 80% code coverage
- All tests must pass before merge

## Documentation

- Update relevant documentation
- Add JSDoc/docstrings
- Update CHANGELOG.md

## Code Review Process

1. All PRs require review
2. Address feedback promptly
3. Keep PRs focused and small
4. Squash commits before merge

## Community Guidelines

- Be respectful and inclusive
- Help others learn
- Give constructive feedback
- Follow our Code of Conduct

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Questions?** Join our [Discussions](https://github.com/connektiv8/SecurePress/discussions)
