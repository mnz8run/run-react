- some-repo

mkdir some-folder

ls -A | grep -wv '.git\|some-folder' | xargs -t -I '{}' git mv {} some-folder/{}

git commit -m "feat: 多仓库合并 目录结构改造"

- target-repo

git remote add some-shortname ../some-repo

git fetch --all

git merge some-shortname/main --allow-unrelated-histories

git remote remove some-shortname
