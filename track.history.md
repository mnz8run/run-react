# 仓库合并操作

```
source a
source b -----> target
source c
```

- source-repo 所有原仓库要执行的操作

mkdir change-your-folder

ls -A | grep -wv '.git\|change-your-folder' | xargs -t -I '{}' git mv {} change-your-folder/{}

git commit -m "feat: 多仓库合并 目录结构改造"

- target-repo 目标仓库要执行的操作

```
# execute for each warehouse
git remote add <some-shortname> <../source-repo>

git fetch --all

# execute for each warehouse
git merge <some-shortname/main> --allow-unrelated-histories

# execute for each warehouse
git remote remove <some-shortname>
```
