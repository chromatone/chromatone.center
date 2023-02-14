cd dist

git init
git remote add origin git@github.com:chromatone/chromatone.center.git 
git add . --force
git commit -m 'deploy'

git push -f origin HEAD:gh-pages

cd -