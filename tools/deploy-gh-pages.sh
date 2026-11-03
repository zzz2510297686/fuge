#!/usr/bin/env bash
# 把站点文件单独发布到 gh-pages 分支（不包含 lib/、tools/、config/ 等工程文件）
# 用法: tools/deploy-gh-pages.sh [远程地址]
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REMOTE="${1:-https://github.com/zzz2510297686/fuge.git}"

# 只发布这些，新增页面记得加进来
SITE_FILES=(index.html products.html news.html contact.html 404.html styles.css script.js assets)

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for f in "${SITE_FILES[@]}"; do
  cp -r "$ROOT/$f" "$TMP/"
done
touch "$TMP/.nojekyll"

cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="FUGE" -c user.email="noreply@fuge.local" commit -q -m "Deploy site $(date +%Y-%m-%d\ %H:%M)"
git push -f "$REMOTE" gh-pages:gh-pages

echo "已发布 $(find . -path ./.git -prune -o -type f -print | wc -l) 个文件到 gh-pages"
