# Branch Protection Setup Guide

## 🔒 Quick Setup Instructions

Follow these steps to enable branch protection on the `main` branch:

### Step 1: Access Branch Protection Settings

1. Go to your repository: https://github.com/verrerie/finx
2. Click **Settings** (top menu)
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add branch protection rule**

### Step 2: Configure Protection Rule

**Branch name pattern:**
```
main
```

**Settings to Enable:**

#### ✅ Require a pull request before merging
- Check this box
- For solo development: Set **Required approvals** to `0`
- For team: Set **Required approvals** to `1` or more
- ✅ Check "Dismiss stale pull request approvals when new commits are pushed"

#### ⬜ Require status checks to pass (Enable when CI/CD is added)
- Skip for now
- Will enable when we add GitHub Actions

#### ✅ Require conversation resolution before merging
- Check this box to ensure all PR comments are resolved

#### ✅ Require linear history (Optional but recommended)
- Ensures clean git history
- No merge commits, only rebase or squash

#### Allow force pushes (For solo development)
- ✅ Enable for "Specify who can force push"
- Select "Restrict who can force push" → Add yourself

#### ⬜ Allow deletions
- Leave unchecked (protects main from accidental deletion)

### Step 3: Save

Click **Create** at the bottom of the page.

---

## 🎯 Minimal Setup (Solo Development)

For solo development, use these minimal settings:

- ✅ Require pull request before merging (0 approvals)
- ✅ Allow force pushes (you only)
- ⬜ Allow deletions (keep unchecked)

This allows you to:
- Maintain PR workflow for documentation
- Review changes before merging
- Keep clean history
- Force push if needed for rebasing

---

## 🔍 Verify Protection is Active

After setup, try to push directly to main:

```bash
git checkout main
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push
```

You should see an error:
```
remote: error: GH006: Protected branch update failed
```

This means protection is working! ✅

To make changes, use a branch and PR instead:
```bash
git reset HEAD~1  # Undo the test commit
git checkout -b test/branch-protection
git push -u origin test/branch-protection
```

Then create a PR on GitHub.

---

## 📚 Further Reading

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CONTRIBUTING.md](.github/CONTRIBUTING.md) - Full workflow guide

