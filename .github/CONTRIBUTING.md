# Contributing to FinX

Thank you for contributing to FinX! This document outlines our development workflow and guidelines.

## 📋 Development Workflow

### Branch Protection Rules

Our `main` branch is protected and requires:
- ✅ Pull Request before merging
- ✅ At least 1 approval (for team projects)
- ✅ All status checks pass (when CI/CD is set up)

**No direct commits to `main` are allowed.**

### Creating a Pull Request

Every change, no matter how small, must go through a PR:

1. **Create a feature branch:**
   ```bash
   git checkout -b <type>/<description>
   ```

   Branch naming convention:
   - `feat/` - New features
   - `fix/` - Bug fixes
   - `docs/` - Documentation changes
   - `refactor/` - Code refactoring
   - `test/` - Test additions or changes
   - `chore/` - Maintenance tasks

2. **Make your changes and commit:**
   ```bash
   git add .
   git commit -m "<type>: <description>"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation only
   - `style:` - Formatting, missing semi colons, etc.
   - `refactor:` - Code change that neither fixes a bug nor adds a feature
   - `test:` - Adding missing tests
   - `chore:` - Changes to build process or auxiliary tools

3. **Push your branch:**
   ```bash
   git push -u origin <branch-name>
   ```

4. **Create a Pull Request on GitHub:**
   - Go to https://github.com/verrerie/finx/pulls
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Submit for review

### Pull Request Template

Use this template for your PRs:

```markdown
## 📚 Description

Brief description of what this PR does.

## ✨ What's New / Changed

- Change 1
- Change 2
- Change 3

## 🎯 Purpose

Why this change is needed.

## 📋 Checklist

- [ ] Code follows project style
- [ ] Tests added/updated (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] All tests pass
- [ ] No lint errors

## 🔗 Related

- Related to Phase X.Y.Z
- Closes #issue-number (if applicable)
```

## 🔒 Setting Up Branch Protection

**Note:** Only repository admins can set up branch protection rules.

### Steps to Enable Branch Protection:

1. Go to **GitHub Repository Settings**
2. Navigate to **Branches** → **Branch protection rules**
3. Click **Add branch protection rule**
4. Branch name pattern: `main`
5. Enable these settings:

   **Required:**
   - ✅ Require a pull request before merging
     - ✅ Require approvals: 1 (or 0 for solo development)
     - ✅ Dismiss stale pull request approvals when new commits are pushed
   
   **Recommended:**
   - ✅ Require status checks to pass before merging (when CI/CD is set up)
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   
   **Optional for Solo Development:**
   - ⬜ Require review from Code Owners
   - ✅ Allow force pushes (only you)
   - ✅ Allow deletions (only you)

6. Click **Create** or **Save changes**

### Quick Setup Script

For solo development, you can use minimal protection:

```json
{
  "required_status_checks": null,
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true
  },
  "restrictions": null,
  "required_linear_history": false,
  "allow_force_pushes": true,
  "allow_deletions": false
}
```

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript 5.7+ strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Formatting

- 4 spaces for indentation (already configured in tsconfig)
- Use semicolons
- Single quotes for strings
- Trailing commas in multiline objects/arrays

### File Organization

```
mcp-<server-name>/
├── src/
│   ├── index.ts          # Main entry point
│   ├── types.ts          # Type definitions
│   ├── cache.ts          # Utility: Caching
│   ├── rate-limiter.ts   # Utility: Rate limiting
│   └── providers/        # Data providers
│       ├── provider-a.ts
│       └── provider-b.ts
├── tsconfig.json         # TypeScript config
└── README.md            # Server documentation
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test:market-data
```

### Writing Tests

- Test files should be co-located or in `__tests__` directories
- Use descriptive test names
- Cover happy path and error cases
- Mock external API calls

## 📚 Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing behavior
- Add/modify MCP tools
- Change configuration options
- Update dependencies

### Documentation Files

- **README.md** - Project overview and quick start
- **USAGE.md** - Detailed usage instructions
- **LEARNING.md** - Educational content and learning path
- **QUICKSTART.md** - Step-by-step exploration guide
- **CONTRIBUTING.md** - This file

## 🚀 Release Process

### Versioning

We use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Creating a Release

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create a git tag:
   ```bash
   git tag -a v0.1.0 -m "Release v0.1.0: Feature description"
   git push origin v0.1.0
   ```
4. Create a GitHub Release with release notes

### Phase Tags

Use phase tags for checkpoints:
- `v0.1.0-phase-1a.1` - Phase 1a, checkpoint 1
- `v0.1.0-phase-1a.2` - Phase 1a, checkpoint 2
- etc.

## 💡 Phase Development Workflow

Each phase follows this workflow:

1. **Plan** - Review phase requirements
2. **Branch** - Create feature branch
3. **Implement** - Build the feature
4. **Test** - Validate functionality
5. **Document** - Update relevant docs
6. **PR** - Create pull request
7. **Review** - Self-review or team review
8. **Merge** - Merge to main after approval
9. **Tag** - Create phase checkpoint tag
10. **Validate** - User validates checkpoint before next phase

## 🤝 Getting Help

- Create an issue for bugs or feature requests
- Use discussions for questions
- Check existing issues before creating new ones

## ⚠️ Important Notes

### What NOT to Commit

Never commit:
- `.env` files (use `.env.example` as template)
- API keys or secrets
- `node_modules/`
- `dist/` directory
- Personal configuration files
- Large binary files

### Git Hooks (Future)

We may add pre-commit hooks for:
- Linting
- Type checking
- Unit tests
- Commit message validation

## 📋 Checklist for Contributors

Before submitting a PR:

- [ ] Code builds successfully
- [ ] Tests pass (if applicable)
- [ ] No linter errors
- [ ] Documentation updated
- [ ] Commit messages follow conventional commits
- [ ] Branch is up to date with main
- [ ] PR description is clear and complete

## 🎓 Learning Contributions

This project emphasizes learning. When contributing:

- **Explain concepts** - Don't just implement, teach
- **Add examples** - Show how to use features
- **Document learnings** - Share what you learned
- **Educational tone** - Make it accessible to learners

Thank you for contributing to FinX! 🚀

