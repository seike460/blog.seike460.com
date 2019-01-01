---
title: ElixirにおけるCircleCI設定
date: 2018-08-11
tags: ["CI", "Elixir"]
---

<p>ElixirにおけるCircleCI設定を簡単ですが纏めておきます</p>

<h1>parroty/excoveralls導入</h1>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8">カバレッジ</a>率を取って一喜一憂したいので、<code>parroty/excoveralls</code> を導入します</p>

<p><iframe src="https://hatenablog-parts.com/embed?url=https%3A%2F%2Fgithub.com%2Fparroty%2Fexcoveralls" title="parroty/excoveralls" class="embed-card embed-webcard" scrolling="no" frameborder="0" style="display: block; width: 100%; height: 155px; max-width: 500px; margin: 10px 0px;"></iframe><cite class="hatena-citation"><a href="https://github.com/parroty/excoveralls">github.com</a></cite></p>

<p><code>mix.exs</code> に追加します</p>

```
def project do
    [
      app: :【あなたのアプリ名】,
      version: "0.0.1",
      elixir: "~> 1.4",
      elixirc_paths: elixirc_paths(Mix.env),
      compilers: [:phoenix, :gettext] ++ Mix.compilers,
      start_permanent: Mix.env == :prod,
      aliases: aliases(),
      test_coverage: [tool: ExCoveralls],　←◯追加
      preferred_cli_env: ["coveralls": :test, "coveralls.detail": :test, "coveralls.post": :test, "coveralls.html": :test],　←◯追加
      deps: deps()
    ]
  end

〜省略〜

  defp deps do
    [
      {:phoenix, "~> 1.3.3"},
      {:phoenix_pubsub, "~> 1.0"},
      {:phoenix_ecto, "~> 3.2"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 2.10"},
      {:phoenix_live_reload, "~> 1.0", only: :dev},
      {:gettext, "~> 0.11"},
      {:excoveralls, "~> 0.9", only: :test},　←◯追加
      {:cowboy, "~> 1.0"}
    ]
  end
```


<p>その後、 <code>mix deps.get</code>して <code>mix coveralls</code>するといい感じに<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8">カバレッジ</a>取れます<br/>
<code>mix coveralls.html</code> を使うとHTMLで見れてカッコいい感じです</p>

<h1>CircleCI導入</h1>

<p><a href="https://fusic.co.jp">Fusic</a>ではCircleCIを利用しています</p>

<p><a href="https://circleci.com">CircleCI</a>にてADD PROJECTS</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519211230.png" alt="f:id:seike460:20180519211230p:plain" title="f:id:seike460:20180519211230p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>Operating System に<a class="keyword" href="http://d.hatena.ne.jp/keyword/Linux">Linux</a>、Language にElixirを選択するとsampleが表示されますので<br/>
Repositoryに<code>.circleci/config.yml</code>に配置します</p>

<p>CircleCIが提供するElixirのContainerImageが若干古かった（当時1.4)だったので<br/>
1.6を使うように変更したり、<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8">カバレッジ</a>を取るようにしました</p>

```
# Elixir CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-elixir/ for more details
version: 2
jobs:
  build:
    docker:
      # specify the version here
      - image: circleci/elixir:1.4
      
      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      # - image: circleci/postgres:9.4

    working_directory: ~/repo
    steps:
      - checkout

      # specify any bash command here prefixed with `run: `
      - run: mix deps.get
      - run: mix ecto.create
      - run: mix test
```

<p>↓</p>

```
# Elixir CircleCI 2.0 configuration file
#
# Check https://circleci.com/docs/2.0/language-elixir/ for more details
version: 2
general:　←◯追加
  artifacts:　←◯追加
    - "cover/excoveralls.html"　←◯追加
jobs:
  build:
    docker:
      # specify the version here
      - image: circleci/elixir:1.6　←△変更
        environment:　←◯追加
          MIX_ENV: test　←◯追加
      # Specify service dependencies here if necessary
      # CircleCI maintains a library of pre-built images
      # documented at https://circleci.com/docs/2.0/circleci-images/
      - image: circleci/postgres:10.4　←△変更
    working_directory: ~/repo
    steps:
      - checkout
      - run: echo 127.0.0.1 【開発環境用postgresqlContainer名】 | sudo tee -a /etc/hosts　←◯追加　※１
      # specify any bash command here prefixed with `run: `
      - run: mix local.hex --force　←◯追加
      - run: mix local.rebar --force　←◯追加
      - run: mix deps.get
      - run: mix ecto.create
      - run: mix coveralls.html　←◯追加
      - store_artifacts:　←◯追加
          path: cover/excoveralls.html　←◯追加
          destination: cover/excoveralls.html　←◯追
```


<p>これで、<code>excoveralls.html</code> にて<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8">カバレッジ</a>の状況を確認することが出来ます</p>

<p>※１で <code>/etc/hosts</code>を置き換えている理由を説明します</p>

<p>開発時は Elixirと<a class="keyword" href="http://d.hatena.ne.jp/keyword/Postgresql">Postgresql</a>のContainerは分けているので<br/>
Container間のつなぎ込みは名前解決で対応しています</p>

<p><code>mix.exs</code> のテスト用指定が test になっているので、<br/>
<a class="keyword" href="http://d.hatena.ne.jp/keyword/%B4%C4%B6%AD%CA%D1%BF%F4">環境変数</a>は <code>MIX_ENV:test</code> として開発環境Containerと<br/>
CircleCIのContainerの設定ファイルは <code>config/test.exs</code> 共<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C4%CC%B2%BD">通化</a>して<br/>
設定ファイルの管理を楽にしたいです</p>

<p>なので、 <code>MIX_ENV:test</code> として設定ファイルを共<a class="keyword" href="http://d.hatena.ne.jp/keyword/%C4%CC%B2%BD">通化</a>しながら、<br/>
CircleCI側の名前解決(<a class="keyword" href="http://d.hatena.ne.jp/keyword/127.0.0.1">127.0.0.1</a>)を開発環境用の名前解決と合わせることで<br/>
上記問題を解決しました。</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180811/20180811021131.png" alt="f:id:seike460:20180811021131p:plain" title="f:id:seike460:20180811021131p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>その後CircleCIにSlackの設定や<a class="keyword" href="http://d.hatena.ne.jp/keyword/AWS">AWS</a>の設定を行なってますが今回は割愛します</p>

