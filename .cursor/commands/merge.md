# Merge Command

This command guides the AI agent through the complete PR merge workflow.

## Workflow Steps

### 1. Review Changes

Before merging, thoroughly review all changes:

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

If issues are found during review:

1. **Fix the issues** - Make necessary corrections
2. **Review again** - Re-check the changes
3. **Repeat** until all issues are resolved

**Common fixes:**
- Run linter and fix issues: `pnpm lint`
- Run tests and fix failures: `pnpm test`
- Fix type errors: `pnpm build`
- Update documentation if needed

**Verification:**
```bash
# Ensure everything passes before proceeding
pnpm lint
pnpm test
pnpm build
```

### 3. Commit and Push

Once all changes are reviewed and verified:

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

After pushing, wait 30 seconds then check CI status:

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

If everything is fine (all checks passing, code reviewed, tests passing):

```bash
# Verify PR is mergeable
gh pr view <PR_NUMBER> --json mergeable,mergeStateStatus

# Squash merge and delete branch
gh pr merge <PR_NUMBER> --squash --delete-branch
```

**Pre-merge Verification:**
- [ ] All CI checks are passing
- [ ] PR is mergeable (no conflicts)
- [ ] All tests pass locally
- [ ] Code review is complete
- [ ] No blocking issues

**After Merge:**
```bash
# Update local main branch
git checkout main
git pull origin main

# Verify merge was successful
git log --oneline -5
```

## Important Notes

- **Never merge without review** - Always review changes first
- **Never merge failing CI** - Wait for all checks to pass
- **Always use squash merge** - Repository policy requires squash merges
- **Always delete branch** - Use `--delete-branch` flag
- **Verify after merge** - Check that merge was successful

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

