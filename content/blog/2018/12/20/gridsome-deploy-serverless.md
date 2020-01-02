---
date: "2018-12-20"
tags: ["Serverless"]
title: GridsomeをCodePipeLine + CodeBuild でDeployするServerlessなBlog
redirect_from:
  - /blog/serverless/gridsome/
---

この記事はServerless Advent Calendar 2018の20日目の記事になります

昨日は[@siruko](https://qiita.com/siruko)さんの[AWS AppSync をシンプルなJavaScriptで試してみる](https://qiita.com/siruko/items/7e3acb963cda209ef631)でした

やっぱりGraphQLは標準になってきそうな勢いですね  
私の記事でも多少触れます

本日の内容はこのBlogを作った話です

-------
## 2018/12/25 追記
その後、同じ静的ジェネレーターの[Gatsby](https://www.gatsbyjs.org/)に切り替えてみました  
理由はやってみたかったからです  
使用感に応じて、Gridsomeとどちらにするか選択しようと思います
-------

[弊社Fusic](https://fusic.co.jp)では[技術Blog](https://tech.fusic.co.jp)を運用しているのですが、  
いわゆる[JAMStack](https://jamstack.org/)なサイトにしたいねと話しています

[Frontend Conference Fukuoka 2018](https://frontend-conf.fukuoka.jp/)で個人的にハマったセッションだった  
[@mottox2](https://twitter.com/mottox2)さんの[CMSとFrontned](https://speakerdeck.com/mottox2/cms-frontend)を聞いた後だったので  
やるしか無いなと思ってましたが私自身に知見がなく、  
〇〇駆動開発で手をつけなきゃなと考えているところでした

運用中サイトの構成変更は調整事項もあり(弊社はエイヤ！でやりそうですが)  
個人の裁量で好き放題する為にも(弊社は個人の裁量でエイヤ！出来ますが)  
はてなブログに頼りきりなのをやめ、ブログサイト運用してみることにしました

というわけで Advent Calendar 駆動開発で、もちろんServerlessに行います

S3 + CloudFrontにGithubからよしなにDeployする方法について書いていきます

## アーキテクチャ

- Static HTML Generator
    - Gridsome
- HTML配信
    - S3 + CloudFront
- Deploy
    - Github + CodePipeLine + CodeBuild

![Architecture](/Architecture.png)

## Gridsome

GridsomeはVue製の静的HTMLジェネレーターです

動的な要素を静的なHTMLによしなに落とし込んでくれるVueのツールです

公式のリンクを参考にしてインストールを進めます

-----

```bash
$ yarn global add @gridsome/cli
$ gridsome create blog.seike460.com
❯ Clone https://github.com/gridsome/gridsome-starter-default.git 1.77s
❯ Update project package.json 0.01s
❯ Install dependencies 147.36s

  - Enter directory cd blog.seike460.com
  - Run gridsome develop to start local development
  - Run gridsome build to build for production

$ cd blog.seike460.com
$ gridsome develop
  Site running at:          http://localhost:8080/
  Explore GraphQL data at:  http://localhost:8080/___explore
```

-----

localhostで動いてる感を出して来るので確認します

![HelloGridsome](/HelloGridsome.png)

簡単過ぎませんかね...  
こういうインストールや利用が簡単な為の仕組みって重要だとしみじみ感じました

僕はMarkdownにてブログ記事が書ける様にしたのですが、  
以下記事を参考にするといい感じに出来ました

- [Gridsomeのmarkdownブログ お試し編](https://isoppp.com/note/2018-10-26/getting-started-gridsome-blog)
- [公式](https://gridsome.org/plugins/transformer-remark/)

本筋ではないので僕の方では割愛します

Gridsomeに少しだけ触れると Vue + GraphQLを使えるので柔軟にサイト構築ができそうです

正月はブログサイトへの機能追加 + はてなブログの記事移行をしたいなぁと考えています

## S3

まずはS3 + CloudFrontにて配信する設定を行いますが、  
S3に関してはやったことある方が多いと思いますので  
公式ドキュメントを貼り付けて終わりにします

[ウェブサイトホスティング用のバケットの設定](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html) 

## CloudFront

次はCloudFrontの設定を進めます

私がCloudFrontを利用しているのはSSL化の為ですので、不必要な方は読み飛ばして構いません

CloudFront Distributionsの画面でdelivery methodをWebにして進めます

![CloudFront1](/CloudFront1.png)

![CloudFront2](/CloudFront2.png)

-----

### Origin Settings

OriginにはS3Bucketを指定します

- Origin Domain Name
    - S3で設定した公開バケットのStatic website hosting エンドポイントを指定します  
        例) hoge-fuga.s3-website-ap-northeast-1.amazonaws.com

- Origin Path
    - Bucket直下にindex.htmlを配置するため空にします
- Origin ID
    - Origin Domain Nameを入力すると自動入力されます
- Restrict Bucket Access
    - S3へのアクセスをCloudFrontに制限する設定です  
    そんなにアクセス来るとは思えないし、単純化の為Noを選択します

![CloudFront3](/CloudFront3.png)

-----

### Default Cache Behavior Settings

Cacheの設定で細かい説明は省きます  
私は基本デフォルトにしてますが変更点と気になりそうな箇所をピックアップして
- Viewer Protocol Policy
    - Redirect HTTP to HTTPS
- Allowed HTTP Methods
    -  最終的に静的なHTMLに対するリクエストなので`GET, HEAD`にしています

![CloudFront4](/CloudFront4.png)

-----

### Distribution Settings

基本デフォルトですが、Domainの設定とSSL証明書は独自のものにします

- Alternate Domain Names
    - blog.seike460.com
- SSL Certificate
    - Custom SSL Certificate (example.com):
        - SSL証明書はACMにて証明書をリクエスト後、  
        DNSに支持されたTXTレコードを設定すれば発行できます

![CloudFront5](/CloudFront5.png)

後は適切にDNSを設定すればサイトが閲覧出来ます

-----

## buildspec.ymlをGithubに配置

まずは下準備の為に buildspec.ymlをGithubに配置します  
デフォルトイメージである Ubuntuにyarnを入れるための設定を書いています  
（毎回インストールが走ると思うとモヤモヤしますが…

流れとしては
- yarn自体のインストール
    - Ubuntuにyarnをいれます
- yarn install
    - Gridsomeのインストールを行います
- yarn run build
    - Gridsomeのbuildを行います
- aws s3 sync
    - GridsomeのファイルをS3にSyncします
- aws cloudfront create-invalidation
    - cloudfrontのキャッシュをクリアします

-----

```yml:title=buildspec.yml
version: 0.2
phases:
  install:
    commands:
      - curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
      - echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
      - sudo apt-get update && sudo apt-get install yarn
      - yarn install
  build:
    commands:
      - yarn run build
    finally:
      - aws s3 sync --exact-timestamps --delete dist s3://blog.seike460.com
  post_build:
    commands:
      - aws cloudfront create-invalidation --distribution-id E3LSKZQ8F7X40H --paths '/*'
```

-----

## CodePipeLine

続いて CodePipeLine + CodeBuildの設定に移ります

目標はGithubのMasterにマージされたらええ感じにDeploy事です

まずは CodePipeLineにてWorkflow構築を行います

### パイプラインの作成

![CodePipeLine1](/CodePipeLine1.png)

- パイプライン名とIAMロールを設定
- アーティファクトストア
    - [入出力アーティファクト](https://docs.aws.amazon.com/ja_jp/codepipeline/latest/userguide/welcome.html#welcome-introducing)の保存先です。デフォルトで良いと思います

![CodePipeLine2](/CodePipeLine2.png)

- ソースプロバイダをGithubに選択してOAuth認証
- リポジトリとブランチを設定
- 変更検出オプションはGithubウェブフックにします

![CodePipeLine3](/CodePipeLine3.png)

- ビルドプロバイダに CodeBuildを設定するとプロジェクト名選択
- 新しく作成する場合はCreate projectを選択

![CodePipeLine4](/CodePipeLine4.png)

## CodeBuild

続いてCodeBuildの設定を行います

![CodeBuild1](/CodeBuild1.png)

- マネージド型イメージを利用
- OSはUbuntu
- ランタイムはNode.js
- バージョンは最新を選択
- 新しいサービスロールを作成
    - ※このサービスロールには以下権限が必要です
        - 公開バケットへのGET
        - 公開バケットへのPUT
        - CloudFrontキャッシュのクリア

![CodeBuild2](/CodeBuild2.png)

- buildspec.ymlを配置しているので、デフォルトのものを利用

![CodeBuild3](/CodeBuild3.png)

設定後、CodePipeLineに進みます

## 再びCodePipeLine

- 作成されたプロジェクトを選択します

![CodePipeLine5](/CodePipeLine5.png)

- ビルドステージでデプロイしてしまっているのと、  
アプリケーションをデプロイする訳ではないのでスキップします

![CodePipeLine6](/CodePipeLine6.png)


## 動作確認

実際にGithubのMasterにMergeします

![GithubMerge](/GithubMerge.png)

すると Github -> CodePipeLine -> CodeBuild と連携されビルドが行われます

![building](/building.png)

最終的に完了です

![complete](/complete.png)

これでひたすらMarkdownを書いてcommitするだけでええ感じにServerlessな配信が出来ます

MasterにMergeされたタイミングでのBuildなのでPRベースでレビューも行えますね

僕はおひとりさまですので、寂しくツラツラとブログを書きます

## サイトデザインについて

だいぶ見にくいですね。。。  
ちょっと頑張って見やすくします。。。

## まとめ

JAMStackの入り口として、まずはGridsomeで作成したサイトをよしなにデプロイ出来るようにしました  
ドッグフーディングしながら機能追加していこうと思います

明日は[@keillera](https://qiita.com/keillera)さんの「何か書きます」です！  
ALIS さんといえばブロックチェーンのイメージが強いですが、どんな記事が上がるか楽しみですね！
