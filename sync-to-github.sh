#!/usr/bin/env bash
# Syncs local website changes to GitHub (todd499/cask-insurance-homepage).
# Pulls first to avoid clobbering any changes made directly on GitHub,
# then commits and pushes any local edits.
set -e

cd "$(dirname "$0")"

if [ -n "$(git status --porcelain)" ]; then
  git add -A
  msg="${1:-Update site $(date -u +%Y-%m-%dT%H:%M:%SZ)}"
  git commit -m "$msg"
fi

git pull --rebase origin main
git push origin main
echo "Synced to GitHub."
