#!/usr/bin/env bash
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

echo ""
echo "##-- Get last remote sources from $branch --##"

git fetch
git rebase $branch

echo ""
echo "##-- Building last sources from $branch --##"

npm run build

echo ""
echo "##-- Commit on $branch --##"

cp -a dist/. docs/dist
git add -f docs/dist
git commit -m "docs: rebuild github pages"
git push -f origin $branch
git checkout $branch
