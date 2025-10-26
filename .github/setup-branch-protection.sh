#!/bin/bash

# Setup Branch Protection for FinX Repository
# This script configures branch protection rules for the main branch

set -e

echo "🔒 Setting up branch protection for 'main' branch..."

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ Error: GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if we're authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Error: Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

# Apply branch protection
echo "📋 Applying branch protection configuration..."
gh api repos/verrerie/finx/branches/main/protection \
    --method PUT \
    --input .github/branch-protection.json

echo ""
echo "✅ Branch protection successfully configured!"
echo ""
echo "📊 Current settings:"
gh api repos/verrerie/finx/branches/main/protection | jq '{
  required_pull_request_reviews: .required_pull_request_reviews,
  allow_force_pushes: .allow_force_pushes,
  allow_deletions: .allow_deletions,
  required_conversation_resolution: .required_conversation_resolution
}'

echo ""
echo "🎉 Done! The 'main' branch is now protected."
echo "   All changes must go through pull requests."

