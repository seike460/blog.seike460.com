---
title: golangでリポジトリ作った時にするCI設定
date: 2018-05-20
tags: ["Go", "CI"]
---
<p>新しいプロジェクトを始めたのでいつもサッとするCI設定をまとめてみました</p>

<h1><a class="keyword" href="http://d.hatena.ne.jp/keyword/dep">dep</a>導入</h1>

<p>CIを回す時にたいてい必要なのでサッと導入します<br/>
インストールしてない場合は <code>go get</code>します</p>

```
go get -u github.com/golang/dep
```

<p>その後Repositoryのルートにて、<a class="keyword" href="http://d.hatena.ne.jp/keyword/dep">dep</a>用のファイルを作成</p>

```
dep init
```

<p><code>Gopkg.toml</code>と<code>Gopkg.lock</code>を<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>にPushしておきます<br/>
いつもはこの段階でCircleCIの設定(<code>.circleci/config.yml</code>)もPushします</p>

<h1>CircleCI導入</h1>

<p><a href="https://fusic.co.jp">Fusic</a>ではCircleCIを利用していますので、僕もCircleCIを利用しています</p>

<p><a href="https://circleci.com">CircleCI</a>にてADD PROJECTS</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519211230.png" alt="f:id:seike460:20180519211230p:plain" title="f:id:seike460:20180519211230p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>Operating System に<a class="keyword" href="http://d.hatena.ne.jp/keyword/Linux">Linux</a>、Language にGoを選択するとsampleが表示されますので<br/>
Repositoryに<code>.circleci/config.yml</code>に配置します</p>

<p>私は少し修正して以下のような形で使ってます<br/>
このテンプレート使うとcoverageのアップロードを行ないます</p>

<p>※<a href="https://twitter.com/haya14busa">@haya14busa</a>さん作成の複数のパッケージをまとめて<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%AB%A5%D0%A5%EC%A5%C3%A5%B8">カバレッジ</a>するための<br/>
<a href="https://github.com/haya14busa/goverage">goverage</a>を使ってます</p>

```
general:
  artifacts:
    - "coverage.out"
jobs:
  build:
    docker:
      - image: circleci/golang:1.9
    working_directory: /go/src/github.com/【アカウント】/【リポジトリ】
    steps:
      - checkout
      - run: go get -u golang.org/x/lint/golint github.com/golang/dep/cmd/dep github.com/haya14busa/goverage
      - run: golint ./...
      - run: go vet ./...
      - run: dep ensure
      - run: goverage -v -coverprofile=coverage.out ./...
      - run: go tool cover -html coverage.out -o coverage.html
      - store_artifacts:
          path: coverage.out                                                                                                                                                                                              destination: coverage.out
      - store_artifacts:
          path: coverage.html
          destination: coverage.html
```

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519211919.png" alt="f:id:seike460:20180519211919p:plain" title="f:id:seike460:20180519211919p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519211943.png" alt="f:id:seike460:20180519211943p:plain" title="f:id:seike460:20180519211943p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>その後CircleCIにSlackの設定や<a class="keyword" href="http://d.hatena.ne.jp/keyword/AWS">AWS</a>の設定を行なってますが今回は割愛します</p>

<h1>Scrutinizer導入</h1>

<p><a href="https://scrutinizer-ci.com/">Scrutinizer</a>にて Add Repository</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519212027.png" alt="f:id:seike460:20180519212027p:plain" title="f:id:seike460:20180519212027p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p><a class="keyword" href="http://d.hatena.ne.jp/keyword/Github">Github</a>を選んで<a class="keyword" href="http://d.hatena.ne.jp/keyword/Github">Github</a> Repositoryに<a class="keyword" href="http://d.hatena.ne.jp/keyword/%A5%EA%A5%DD%A5%B8%A5%C8%A5%EA">リポジトリ</a>名を入力<br/>
Default Configに「Go」を選択<br/>
Scrutinizerのcoverage Badgeを表示したいのでScrutinizerでもTestを走らせてます<br/>
Tests チェックしてAdd Repository</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519212124.png" alt="f:id:seike460:20180519212124p:plain" title="f:id:seike460:20180519212124p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>coverage を取りたいので設定変更します<br/>
左メニューのスパナを選んでConfigurationを選択します<br/>
Repository Configを変更します</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519212205.png" alt="f:id:seike460:20180519212205p:plain" title="f:id:seike460:20180519212205p:plain" class="hatena-fotolife" itemprop="image"></span></p>

```
build:
  nodes:
    analysis:
      project_setup:
        override:
          - 'true'
      environment:
        go:
          version: go1.9.2
      tests:
        override:
          - command: go get -u github.com/haya14busa/goverage
          - go-scrutinizer-run
          - govet-run
          - golint-run
          -
            command: goverage -v -coverprofile=coverage.out ./...
            coverage:
              file: 'coverage.out'
              format: 'go-cc'
```

<p>変更するとBadgeのcoverageが表示されます<br/>
Badgeは<a class="keyword" href="http://d.hatena.ne.jp/keyword/github">github</a>のREADME.mdに記述しておきます<br/>
README.mdに記述する内容はTOP画面の<br/>
Badgesリンクを押下するとコピペする内容がわかります</p>

<p><span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519212350.png" alt="f:id:seike460:20180519212350p:plain" title="f:id:seike460:20180519212350p:plain" class="hatena-fotolife" itemprop="image"></span></p>

<p>README.mdにBadgeが表示されると気持ちいいです<br/>
※下記画像はプロジェクト開始直後に作成した、最高に気持ちいい状態です
<span itemscope itemtype="http://schema.org/Photograph"><img src="https://cdn-ak.f.st-hatena.com/images/fotolife/s/seike460/20180519/20180519212404.jpg" alt="f:id:seike460:20180519212404j:plain" title="f:id:seike460:20180519212404j:plain" class="hatena-fotolife" itemprop="image"></span></p>
