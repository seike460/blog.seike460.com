---
title: Macにanyenvを使ってelixirをインストールする
date: 2018-08-05
tags: ["Elixir"]
---

<p>開発環境をDockerを使わずに構築したので忘備録</p>

<p>Dockerを使うと、すんなり準備出来てしまって何が必要かほとんど把握出来なかったのと<br/>
手元の<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>ですぐ確認したい事ありそうなので、手元で構築してみようと思いました</p>

<h1>anyenvをインストール</h1>

<p>exenvでバージョン管理したいので、anyenvを使います</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Friywo%2Fanyenv" title="riywo/anyenv" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/riywo/anyenv">github.com</a></cite></p>

<p>READMEに書いてますが、インストールしてない人は以下で設定してください。(<a class="keyword" href="http://d.hatena.ne.jp/keyword/zsh">zsh</a>用です)</p>

```
$ git clone https://github.com/riywo/anyenv ~/.anyenv
$ echo 'export PATH="$HOME/.anyenv/bin:$PATH"' >> ~/.zprofile
$ echo 'eval "$(anyenv init -)"' >> ~/.zprofile
$ exec $SHELL -l<Paste>
```


<p>anyenv-updateもインストールしていた方が良いと思います</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fznz%2Fanyenv-update" title="znz/anyenv-update" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/znz/anyenv-update">github.com</a></cite></p>

```
$ git clone https://github.com/znz/anyenv-update.git $(anyenv root)/plugins/anyenv-update
```


<h1>erlenvをインストール</h1>

```
$ anyenv install erlenv
```

<p>新しめの<a class="keyword" href="http://d.hatena.ne.jp/keyword/erlang">erlang</a>をいれます<br/>
erlenvは install コマンドがなくてmake するっぽい<br/>
ファイルを落としてインストール<br/>
<a class="keyword" href="http://d.hatena.ne.jp/keyword/java">java</a>とかいろいろ入れてるのは、途中でエラー出たので、随時追加しました<br/>
--with-<a class="keyword" href="http://d.hatena.ne.jp/keyword/ssl">ssl</a>は<a class="keyword" href="http://d.hatena.ne.jp/keyword/Mac">Mac</a>の<a class="keyword" href="http://d.hatena.ne.jp/keyword/brew">brew</a>管理してるopensslを利用したかったためです</p>

<p><a href="http://www.erlang.org/download">http://www.erlang.org/download</a> にてダウンロードする<a class="keyword" href="http://d.hatena.ne.jp/keyword/erlang">erlang</a>を決めます</p>

<p>今回は20.3</p>

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

<h1>exenvをインストール</h1>

```
$ anyenv install exenv
$ exenv install -l ← 1.7.1が最新だった
$ exenv install 1.7.1
$ exenv global 1.7.1
$ elixir -v
```

<p>anyenvとかDockerとか環境構築が楽になったなーとしみじみ思いました。</p>

<p>開発には普通にDockerを使おうと思います</p>
