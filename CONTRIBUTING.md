# Contributing to Solana Betting dApp

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/solana-betting-dapp.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit: `git commit -am 'Add new feature'`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

Follow the setup instructions in [QUICKSTART.md](QUICKSTART.md) or [docs/SETUP.md](docs/SETUP.md).

## Code Standards

### Rust (Smart Contract)
- Follow Rust style guidelines
- Use `cargo fmt` for formatting
- Use `clippy` for linting
- Add tests for new features
- Document public functions

### TypeScript (Frontend)
- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful component names
- Add JSDoc comments for complex functions

## Testing

### Smart Contract
```bash
cd program
anchor test
```

### Frontend
```bash
cd frontend
npm run build
npm run lint
```

## Pull Request Process

1. **Update Documentation**: If you change functionality, update relevant docs
2. **Test Thoroughly**: Ensure all tests pass
3. **Clear Description**: Explain what changes you made and why
4. **Small PRs**: Keep PRs focused on a single feature/fix
5. **Code Quality**: Follow existing code style and patterns

## What to Contribute

### Welcomed Contributions
- Bug fixes
- Documentation improvements
- Performance optimizations
- Test coverage improvements
- UI/UX enhancements
- Accessibility improvements
- New features (discuss in issues first)

### Areas for Improvement
- Dynamic odds calculation
- Oracle integration
- Database indexer
- Real-time WebSocket updates
- Multi-outcome events
- Mobile responsiveness
- Internationalization

## Reporting Bugs

Use GitHub Issues and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Node version, etc.)

## Feature Requests

Open an issue with:
- Clear description of the feature
- Use cases and benefits
- Potential implementation approach
- Mockups or examples if applicable

## Security Issues

**DO NOT** open public issues for security vulnerabilities.
Email security concerns to: ritikravi7724@gmail.com

## Code Review

All submissions require review. We use GitHub pull requests for this purpose.

## Community Guidelines

- Be respectful and constructive
- Help others learn and grow
- Focus on what is best for the community
- Show empathy towards other community members

## Questions?

Feel free to open an issue for questions or join discussions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
