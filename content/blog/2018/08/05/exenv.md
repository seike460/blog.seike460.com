---
title: Macにanyenvを使ってelixirをインストールする
date: 2018-08-05
tags: ["Elixir"]
---

開発環境をDockerを使わずに構築したので忘備録

Dockerを使うと、すんなり準備出来てしまって何が必要かほとんど把握出来なかったのと<br/>
手元のMacですぐ確認したい事ありそうなので、手元で構築してみようと思いました

<h2>anyenvをインストール</h2>

exenvでバージョン管理したいので、anyenvを使います

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Friywo%2Fanyenv" title="riywo/anyenv" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/riywo/anyenv">github.com</a></cite>

READMEに書いてますが、インストールしてない人は以下で設定してください。(zsh用です)

```
$ git clone https://github.com/riywo/anyenv ~/.anyenv
$ echo 'export PATH="$HOME/.anyenv/bin:$PATH"' >> ~/.zprofile
$ echo 'eval "$(anyenv init -)"' >> ~/.zprofile
$ exec $SHELL -l<Paste>
```


anyenv-updateもインストールしていた方が良いと思います

<iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fznz%2Fanyenv-update" title="znz/anyenv-update" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/znz/anyenv-update">github.com</a></cite>

```
$ git clone https://github.com/znz/anyenv-update.git $(anyenv root)/plugins/anyenv-update
```


<h2>erlenvをインストール</h2>

```
$ anyenv install erlenv
```

新しめのerlangをいれます<br/>
erlenvは install コマンドがなくてmake するっぽい<br/>
ファイルを落としてインストール<br/>
javaとかいろいろ入れてるのは、途中でエラー出たので、随時追加しました<br/>
--with-sslはMacのbrew管理してるopensslを利用したかったためです

<a href="http://www.erlang.org/download">http://www.erlang.org/download</a> にてダウンロードするerlangを決めます

今回は20.3

```
$ wget http://www.erlang.org/download/otp_src_20.3.tar.gz
$ tar zxf otp_src_20.3.tar.gz
$ cd otp_src_20.3
$ brew cask install java
$ brew install unixodbc wxmac fop
$ ./configure --prefix=$HOME/.anyenv/envs/erlenv/releases/20.3 --with-ssl=$(brew --prefix openssl)
$ make
$ make install
$ erlenv global 20.3
$ erlenv rehash
```

<h2>exenvをインストール</h2>

```
$ anyenv install exenv
$ exenv install -l ← 1.7.1が最新だった
$ exenv install 1.7.1
$ exenv global 1.7.1
$ elixir -v
```

anyenvとかDockerとか環境構築が楽になったなーとしみじみ思いました。

開発には普通にDockerを使おうと思います
