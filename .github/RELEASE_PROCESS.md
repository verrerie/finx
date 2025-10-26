# Automatic Release Process

## Overview

This repository uses an automated release workflow that creates version tags and GitHub releases whenever code is merged to the `main` branch.

## How It Works

### Trigger
The release workflow automatically runs when:
- A pull request is merged to `main`
- Code is pushed directly to `main` (though this is prevented by branch protection)

### Version Calculation

The workflow uses **Semantic Versioning** (MAJOR.MINOR.PATCH) based on **Conventional Commits**:

#### Version Bumps

1. **MAJOR** version (x.0.0) - Breaking changes
   - Commits with `BREAKING CHANGE:` in body
   - Commits with `!` after type: `feat!:`, `fix!:`, etc.
   - Example: `feat!: remove deprecated API`

2. **MINOR** version (0.x.0) - New features
   - Commits starting with `feat:` or `feat(scope):`
   - Example: `feat: add new learning prompt`

3. **PATCH** version (0.0.x) - Bug fixes and other changes
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance tasks
   - `ci:` - CI/CD changes
   - `style:` - Code style changes
   - `perf:` - Performance improvements
   - `test:` - Test changes

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Examples:**

```bash
# Patch release (bug fix)
fix: resolve null pointer in cache module

# Minor release (new feature)
feat: add explain_fundamental tool to Market Data server

# Major release (breaking change)
feat!: redesign portfolio API with new schema

BREAKING CHANGE: Portfolio API now requires different parameters

# With scope
feat(market-data): add peer comparison feature
fix(ci): resolve pnpm version conflict
docs(readme): update installation instructions
```

### Changelog Generation

The workflow automatically generates a structured changelog:

```markdown
## What's Changed

### ✨ Features
- feat: add new tool (abc123)
- feat(ui): improve dashboard layout (def456)

### 🐛 Bug Fixes
- fix: resolve caching issue (ghi789)

### 📚 Documentation
- docs: update README with new examples (jkl012)

### ♻️ Refactoring
- refactor: move docs to docs/ directory (mno345)

### 🔧 CI/CD
- ci: add automatic release workflow (pqr678)

---

**Full Changelog**: https://github.com/verrerie/finx/compare/v0.2.0...v0.3.0
```

## Release Workflow Steps

1. **Detect Changes**: Analyzes commits since last tag
2. **Calculate Version**: Determines bump type (major/minor/patch)
3. **Generate Changelog**: Groups commits by type with emojis
4. **Create Tag**: Creates annotated git tag (e.g., `v0.3.0`)
5. **Publish Release**: Creates GitHub release with changelog
6. **Summary**: Posts release summary to GitHub Actions

## Current Version

Check the latest version:
- GitHub: [Releases page](https://github.com/verrerie/finx/releases)
- Git: `git describe --tags --abbrev=0`
- Badge: ![Latest Release](https://img.shields.io/github/v/release/verrerie/finx)

## Manual Release (If Needed)

If the automatic release fails or you need to create a manual release:

```bash
# 1. Create and push a tag
git tag -a v0.3.0 -m "Release v0.3.0"
git push origin v0.3.0

# 2. Create release via GitHub CLI
gh release create v0.3.0 \
  --title "v0.3.0" \
  --notes "Release notes here"

# Or via GitHub web interface:
# https://github.com/verrerie/finx/releases/new
```

## Version History

The version history follows this pattern:

- **v0.1.0** - Initial Market Data MCP server with 4 core tools
- **v0.2.0** - Added learning features (explain_fundamental, compare_peers) + CI/CD
- **v0.3.0** - Added learning prompts and Cursor configuration
- **v0.4.0+** - Future releases (automatic)

## Best Practices

### For Developers

1. **Use Conventional Commits**
   - Always start commit messages with a type: `feat:`, `fix:`, `docs:`, etc.
   - Use scopes when helpful: `feat(market-data):`, `fix(ci):`
   - Write clear, descriptive commit messages

2. **Breaking Changes**
   - Clearly mark with `!` or `BREAKING CHANGE:`
   - Explain what breaks and how to migrate
   - Consider if it's really necessary (major versions are disruptive)

3. **Squash PRs Thoughtfully**
   - Since we use squash merges, the PR's final commit message determines the version bump
   - Make sure the squashed commit message follows conventions
   - Include all significant changes in the commit body

4. **Test Before Merging**
   - CI must pass before merge
   - Review the commit message that will be created
   - Ensure the version bump will be appropriate

### Commit Message Tips

**Good commit messages:**
```
✅ feat: add compare_peers tool for sector analysis
✅ fix(ci): resolve pnpm version conflict in workflow
✅ docs: add comprehensive testing guide
✅ refactor: move documentation to docs/ directory
```

**Bad commit messages:**
```
❌ update files
❌ fixes
❌ wip
❌ Merge pull request #42
```

## Troubleshooting

### No Release Created

**Problem**: Push to main but no release appeared

**Solutions:**
1. Check [Actions tab](https://github.com/verrerie/finx/actions) for workflow status
2. Verify commit messages follow conventional format
3. Check workflow logs for errors
4. Ensure no commits with `[skip ci]` in message

### Wrong Version Bump

**Problem**: Release version doesn't match expected bump

**Solutions:**
1. Review commit messages - they determine the bump type
2. Use `feat:` for minor bumps, `fix:` for patches
3. Check if multiple types exist - workflow picks highest bump
4. Create manual tag if version is critical

### Changelog Missing Commits

**Problem**: Some commits not in changelog

**Solutions:**
1. Verify commits exist between tags: `git log v0.2.0..v0.3.0`
2. Check if commits follow conventional format
3. Non-conventional commits go to "Other Changes" section

## Maintenance

### Update Release Workflow

The workflow file is at `.github/workflows/release.yml`.

**Common updates:**
- Modify version bump logic
- Adjust changelog formatting
- Add new commit types
- Change release template

After updating, test with:
1. Create a test PR
2. Merge to main
3. Verify release is created correctly
4. Roll back if needed: delete tag and release

### Permissions

The workflow requires:
- `contents: write` - Create tags and releases
- `pull-requests: read` - Read PR information

These are configured in the workflow file.

## Examples

### Example 1: Feature Release (Minor Bump)

```bash
# Make changes
git checkout -b feat/new-tool
# ... code changes ...

# Commit with feat: prefix
git commit -m "feat: add dividend analysis tool

Adds new tool to calculate and explain dividend metrics:
- Dividend yield
- Payout ratio
- Dividend growth rate"

# Create PR and merge
gh pr create --title "feat: add dividend analysis tool"
# ... PR merged to main ...

# Result: Automatic release v0.3.0 → v0.4.0
```

### Example 2: Bug Fix Release (Patch Bump)

```bash
# Fix bug
git checkout -b fix/cache-issue
# ... fix code ...

git commit -m "fix: resolve cache expiration bug

Cache wasn't properly expiring after TTL, causing
stale data to be returned."

gh pr create --title "fix: resolve cache expiration bug"
# ... PR merged to main ...

# Result: Automatic release v0.4.0 → v0.4.1
```

### Example 3: Documentation Update (Patch Bump)

```bash
# Update docs
git checkout -b docs/improve-readme
# ... update docs ...

git commit -m "docs: add examples to README

Added 3 example workflows showing common use cases"

gh pr create --title "docs: add examples to README"
# ... PR merged to main ...

# Result: Automatic release v0.4.1 → v0.4.2
```

### Example 4: Breaking Change (Major Bump)

```bash
# Make breaking change
git checkout -b feat/new-api
# ... significant API changes ...

git commit -m "feat!: redesign Market Data API

BREAKING CHANGE: The get_quote tool now returns
a different structure. Update your code:

Old: { price: 100 }
New: { current: { price: 100 } }

Migration guide in docs/MIGRATION.md"

gh pr create --title "feat!: redesign Market Data API"
# ... PR merged to main ...

# Result: Automatic release v0.4.2 → v1.0.0
```

## FAQ

**Q: Can I skip a release?**  
A: Add `[skip ci]` to commit message, but this is discouraged. Consider if the changes really should go to main.

**Q: Can I edit a release after it's created?**  
A: Yes, edit via GitHub web interface or `gh release edit v0.3.0`

**Q: What if I need to delete a release?**  
A: `gh release delete v0.3.0` and `git push origin :refs/tags/v0.3.0`

**Q: Can I create pre-releases?**  
A: Not automatically. Create manually with `--prerelease` flag.

**Q: How do I see what's in the next release?**  
A: Check commits since last tag: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`

---

**Remember**: Good commit messages = good changelogs = good releases! 🚀

