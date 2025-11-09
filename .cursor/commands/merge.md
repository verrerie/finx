# Merge Command

This command guides the AI agent through the complete PR merge workflow.

## Core Principles

**Safety First**
- Never merge without review - Always review changes first
- Never merge failing CI - Wait for all checks to pass
- Always verify before merging - Check that all requirements are met

**Repository Policy**
- Always use squash merge - Repository policy requires squash merges
- Always delete branch - Use `--delete-branch` flag
- Follow Conventional Commits - Use proper commit message format

**Workflow Integrity**
- Verify after merge - Check that merge was successful
- Fix issues before proceeding - Don't skip verification steps
- Follow the complete workflow - Don't skip steps

## Workflow Steps

### 1. Review Changes

**Action Required:**

1. **Review All Changes:**
   - Check current branch and status
   - Review the diff against main
   - Review commit history
   - Check for any uncommitted changes

2. **Verify Changes:**
   - Ensure all changes are intentional and correct
   - Verify no debug code or console.logs left behind
   - Confirm no commented-out code
   - Check code follows project conventions

**Tool Usage:**
- Use bash commands for git operations

**Example Commands:**
```bash
# Check current branch and status
git status

# Review the diff against main
git diff main

# Review commit history
git log --oneline main..HEAD

# Check for any uncommitted changes
git status --porcelain
```

**Review Checklist:**
- [ ] All changes are intentional and correct
- [ ] No debug code or console.logs left behind
- [ ] No commented-out code
- [ ] Code follows project conventions
- [ ] Tests are included for new functionality
- [ ] Documentation is updated if needed

### 2. Fix or Improve if Necessary

**Action Required:**

1. **Fix Issues:**
   - Make necessary corrections
   - Run linter and fix issues
   - Run tests and fix failures
   - Fix type errors
   - Update documentation if needed

2. **Verify Fixes:**
   - Re-check the changes
   - Ensure all checks pass
   - Repeat until all issues are resolved

**Tool Usage:**
- Use bash commands for test/lint/build operations

**Example Commands:**
```bash
# Run linter and fix issues
pnpm lint

# Run tests and fix failures
pnpm test

# Fix type errors
pnpm build

# Ensure everything passes before proceeding
pnpm lint
pnpm test
pnpm build
```

### 3. Commit and Push

**Action Required:**

1. **Stage Changes:**
   - Stage all changes for commit

2. **Commit Changes:**
   - Commit with descriptive message following Conventional Commits format
   - Use appropriate type: `fix:`, `feat:`, `refactor:`, `test:`, `docs:`, etc.
   - Include clear description
   - Add bullet points for multiple changes

3. **Push to Remote:**
   - Push to remote branch

**Tool Usage:**
- Use bash commands for git operations

**Example Commands:**
```bash
# Stage all changes
git add -A

# Commit with descriptive message following Conventional Commits
git commit -m "type: description

- Detail 1
- Detail 2
- Detail 3"

# Push to remote branch
git push
```

**Commit Message Guidelines:**
- Follow [Conventional Commits](https://www.conventionalcommits.org/) format
- Use appropriate type: `fix:`, `feat:`, `refactor:`, `test:`, `docs:`, etc.
- Include clear description
- Add bullet points for multiple changes

### 4. Check CI Status

**Action Required:**

1. **Wait for CI to Start:**
   - Wait at least 30 seconds after push
   - Allow CI time to initialize

2. **Check CI Status:**
   - Check CI status for the PR
   - Verify all checks are passing (or at least started)
   - If checks are still pending, wait longer and check again
   - If checks fail, fix issues and repeat from step 2

**Tool Usage:**
- Use bash commands for GitHub CLI operations

**Example Commands:**
```bash
# Wait 30 seconds for CI to start
sleep 30

# Check CI status for the PR
gh pr checks <PR_NUMBER>

# Or view detailed status
gh pr view <PR_NUMBER> --json statusCheckRollup --jq '.statusCheckRollup[] | {name: .name, status: .status, conclusion: .conclusion}'
```

**CI Status Check:**
- Wait at least 30 seconds after push
- Verify all checks are passing (or at least started)
- If checks are still pending, wait longer and check again
- If checks fail, fix issues and repeat from step 2

### 5. Squash Merge to Main

**Action Required:**

1. **Verify Pre-merge Requirements:**
   - All CI checks are passing
   - PR is mergeable (no conflicts)
   - All tests pass locally
   - Code review is complete
   - No blocking issues

2. **Perform Squash Merge:**
   - Verify PR is mergeable
   - Squash merge and delete branch

3. **Verify Merge:**
   - Update local main branch
   - Verify merge was successful

**Tool Usage:**
- Use bash commands for git and GitHub CLI operations

**Example Commands:**
```bash
# Verify PR is mergeable
gh pr view <PR_NUMBER> --json mergeable,mergeStateStatus

# Squash merge and delete branch
gh pr merge <PR_NUMBER> --squash --delete-branch

# Update local main branch
git checkout main
git pull origin main

# Verify merge was successful
git log --oneline -5
```

**Pre-merge Verification:**
- [ ] All CI checks are passing
- [ ] PR is mergeable (no conflicts)
- [ ] All tests pass locally
- [ ] Code review is complete
- [ ] No blocking issues

## Important Notes

- **Never merge without review** - Always review changes first
- **Never merge failing CI** - Wait for all checks to pass
- **Always use squash merge** - Repository policy requires squash merges
- **Always delete branch** - Use `--delete-branch` flag
- **Verify after merge** - Check that merge was successful
- **Follow the complete workflow** - Don't skip verification steps

## Error Handling

If any step fails:

1. **Review fails** → Fix issues and review again
2. **Tests fail** → Fix tests and re-run
3. **CI fails** → Fix issues, commit, push, and check again
4. **Merge fails** → Check for conflicts or repository settings

## Example Workflow

```bash
# 1. Review changes
git status
git diff main

# 2. Fix issues if any
pnpm lint
pnpm test
pnpm build

# 3. Commit and push
git add -A
git commit -m "fix: resolve linting issues"
git push

# 4. Check CI (wait 30s)
sleep 30
gh pr checks 28

# 5. Merge if all checks pass
gh pr merge 28 --squash --delete-branch
```

