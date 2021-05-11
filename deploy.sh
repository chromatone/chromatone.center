cd .vitepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:chromatone/chromatone.center.git master:gh-pages

cd -