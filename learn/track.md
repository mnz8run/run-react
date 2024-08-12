## 相关信息

`https://github.com/line126/feel-react18.git`
main react18rc

`https://github.com/line126/feel-react-zero.git`
main
tag: v1

`https://github.com/line126/feel-react-own.git`
main

## track

### 创建目录

`mkdir learn-react`

### 克隆多个仓库

`git clone <仓库地址>` 只需要一个分支的情况也可以使用 `git clone -b <分支名> <仓库地址>`

`git clone https://github.com/line126/feel-react18.git`
`git clone https://github.com/line126/feel-react-own.git`
`git clone https://github.com/line126/feel-react-zero.git`

### 调整已有仓库的目录结构

期望合并过去的项目都是在自己单独的目录下，
如果直接合并，实际是工程目录下的文件/文件夹 平铺到合并后的，
而且会存在冲突，所以希望合并过去的子项目，都位于合并工程的特定子目录中。

`cd feel-react-own`
`mkdir react-own`
`ls -A | grep -wv '.git\|react-own' | xargs -t -I '{}' git mv {} react-own/{}`

`cd feel-react-zero`
`mkdir react-zero`
`ls -A | grep -wv '.git\|react-zero' | xargs -t -I '{}' git mv {} react-zero/{}`

`cd feel-react18`
`mkdir react-18`
`ls -A | grep -wv '.git\|react-18' | xargs -t -I '{}' git mv {} react-18/{}`

所有仓库提交改动（本地提交，远程不提交）：目录结构改造

### learn-react git 初始化

如果想要更清晰，可以提交一次：基础分支

### learn-react 添加 remote

`git remote add <shortname> <子项目本地仓库地址>`

`git remote add own ./feel-react-own`
`git remote add zero ./feel-react-zero`
`git remote add 18 ./feel-react18`

```
$ git remote -v
18      ./feel-react18 (fetch)
18      ./feel-react18 (push)
own     ./feel-react-own (fetch)
own     ./feel-react-own (push)
zero    ./feel-react-zero (fetch)
zero    ./feel-react-zero (push)
```

```
$ git branch -a
* main
```

### fetch

`git fetch --all`

克隆下来默认只有主分支，需要其他分支需要 checkout, 这样 `git fetch --all` 时才有。

```
$ git branch -a
* main
  remotes/18/main
  remotes/own/main
  remotes/zero/main
```

### 合并 remote 分支

这里都是 main 分支

`--allow-unrelated-histories` 允许无关的历史

`git merge 18/main --allow-unrelated-histories`
`git merge own/main --allow-unrelated-histories`
`git merge zero/main --allow-unrelated-histories`

如果有冲突，合并一下

### 删除 remote

`git remote remove own`
`git remote remove zero`
`git remote remove 18`

### 删除所有之前的仓库

`rm -rf feel-react-own feel-react-zero feel-react18`

### 提交远程

## 合并后，在对某个分支单独操作

`cd feel-react18`
`git checkout react18rc`
`mkdir react-18rc`
`ls -A | grep -wv '.git\|react-18rc' | xargs -t -I '{}' git mv {} react-18rc/{}`
所有仓库提交改动（本地提交，远程不提交）：目录结构改造

`git remote remove 18`
`git remote add 18 ./feel-react18`
这里再没有删除远程仓库的情况下，没有识别到后来修改的 `react-18rc` 分支，
所以删除，重新添加了一下。
如果一开始就要多个分支，可以在添加 remote 前，就对需要的分支，执行相应的目录调整操作。

`git fetch -a`
`git merge 18/react18rc --allow-unrelated-histories`

## 对 `react-18rc` 分支 一起做修改的记录

```
$ git fetch --all
Fetching own
remote: Enumerating objects: 50, done.
remote: Counting objects: 100% (50/50), done.
remote: Compressing objects: 100% (31/31), done.
remote: Total 50 (delta 16), reused 48 (delta 16), pack-reused 0
Unpacking objects: 100% (50/50), 111.59 KiB | 652.00 KiB/s, done.
From ./feel-react-own
 * [new branch]      main       -> own/main
Fetching zero
remote: Enumerating objects: 83, done.
remote: Counting objects: 100% (83/83), done.
remote: Compressing objects: 100% (47/47), done.
remote: Total 83 (delta 23), reused 81 (delta 23), pack-reused 0
Unpacking objects: 100% (83/83), 13.78 KiB | 57.00 KiB/s, done.
From ./feel-react-zero
 * [new branch]      main       -> zero/main
 * [new tag]         v1         -> v1
Fetching 18
remote: Enumerating objects: 23, done.
remote: Counting objects: 100% (23/23), done.
remote: Compressing objects: 100% (16/16), done.
remote: Total 22 (delta 2), reused 16 (delta 2), pack-reused 0
Unpacking objects: 100% (22/22), 4.10 KiB | 56.00 KiB/s, done.
From ./feel-react18
 * [new branch]      main       -> 18/main
 * [new branch]      react18rc  -> 18/react18rc
```

```
$ git branch -a
* main
  remotes/18/main
  remotes/18/react18rc
  remotes/own/main
  remotes/zero/main
```
