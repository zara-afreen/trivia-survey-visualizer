#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd build

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy' --allow-empty

# Deploy to GitHub Pages using SSH
git push -f git@github.com:zara-afreen/trivia-survey-visualizer.git main:gh-pages

cd -
