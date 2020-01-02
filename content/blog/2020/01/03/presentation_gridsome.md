---
date: "2020-01-03"
tags: ["Serverless", "Gridsome"]
title: プレゼンテーション層におけるGridsome
---

前回はサーバーレスにおける3層アプリケーションの分類を説明しました。  
今回はプレゼンテーション層にGridsomeを利用する方法を考えます。

Gridsomeを使うモチベーションは、何度もHTMLを書きたくないなと思った事です。

## Gridsomeの導入

Gridsomeの導入は[IntroductionのHow to Install](https://gridsome.org/docs/#how-to-install)を読めば良いのですが、日本語ドキュメントとして残します。

※yarnをベースに書きます。

### GridsomeのCLIをインストール

まずはGridsomeのプロジェクトを作成するために、GridsomeのCLIをインストールします。

```bash
$ yarn global add @gridsome/cli
```

### Gridsome プロジェクト 作成

インストールしたGridsome CLIを使って、Gridsomeのプロジェクトを作成します。

```bash
$ gridsome create hoge # hogeプロジェクトを作成します
$ cd hoge #作成したhogeプロジェクトに移動します
$ gridsome develop #hogeプロジェクトの開発を開始します

〜 Compile Log が流れます 〜

 DONE  Compiled successfully in 354ms

  Site running at:
  - Local:                 http://localhost:8080/
  - Network:               http://192.168.1.46:8080/

  Explore GraphQL data at: http://localhost:8080/___explore
```

## MarkdownからGraphQL用のデータを取得

`pages`ディレクトリに実際のコンテンツを作成していきます。  
今回レーティングアンケートサービスを作成する為以下の構成を取ります。  

- Index
    - アンケート一覧
- Survey
    - アンケート入力画面

何度もアンケートを作成するため、簡単にアンケートを複製できる様にします。  
今回はMarkdownファイルを追加するとコンテンツが作成できるように調整します

[Importing dataのImport with source plugins](https://gridsome.org/docs/fetching-data/#import-with-source-plugins)を参考に、Markdownを元にページを生成出来るようにします。

これに加えて、以下２つのプラグインをインストールする必要があります。

- @gridsome/source-filesystem
- @gridsome/transformer-remark

```bash
$ yarn add @gridsome/source-filesystem
$ yarn add @gridsome/transformer-remark
```

以下の例だと、`survey`ディレクトリのmarkdownファイルをパースして、コンテンツに利用できます。

```javascript:title=gatsby-config.js
module.exports = {
  siteName: 'survey.seike460.com',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'survey/*.md',
        typeName: 'SurveyPage'
      }
    }
  ]
}
```

## アンケート一覧Indexページ作成

Indexページではアンケート入力画面へのリンクを生成します。  
本システムは僕自身が登壇するカンファレンスのアンケートを目的としていますので、  
登壇するカンファレンス一覧をMarkDownファイルから生成させます

属性としては以下を注入したいです

- カンファレンス名
- 登壇タイトル
- 登壇日時
- 登壇場所

GraphQLに属性として注入したいので YAML front matter で定義します  
僕はPHPerKaigi2020で登壇する日程が決まっているので、下記のように属性を注入します

```markdown:title=survey/phperkaigi2020.md
---
conference: PHPerKaigi 2020
title: Serverless Pattern
datetime: 2020/02/11 15:00
place: PHPerKaigi 2020
---

Serverlessは一般化してきています。

Serverless においてある程度決まったPatternがあります。

ServerlessなArchitectureを組むことでそのシステムはどの様なメリットを享受出来るのでしょうか。

今回はAWSを利用したServerless Patternを適用することで、
そのシステムが享受出来るメリットと構築する上での注意点を解説します。

- 想定する聴講者
  - Serverlessに興味のあるWEBエンジニア
  - AWSを利用しているクラウド系エンジニア

- お話する内容
  - AWS Lambdaを中心としたServerless Pattern
  - Serverless Patternを構築するうえで考えるべきAWSリソースの特徴
  - Serverless Patternを構築することで得られるメリット
  - Serverless Patternを利用するうえで注意すべき事項

- お話しない内容
  - GCP、Azureの話
  - PHPを利用したServerless Pattern
```

こちらを利用してIndexページを作成します

```javascript:title=src/pages/Index.vue
<template>
  <Layout>
    <h2 class="description">
      登壇をより良くするために忌憚なきフィードバックをください！
    </h2>
    <div class="article">
      <hr>
      <div v-for="item in $page.allSurveyPage.edges">
        <h3><a v-bind:href="item.node.path" v-html="item.node.conference"/></h3>
        <ul>
          <li v-html="item.node.title"/>
        </ul>
      </div>
    </div>
    <hr>
  </Layout>
</template>

<style>
.article {
  margin: 1rem;
}
</style>

<page-query>
query posts {
  allSurveyPage {
    edges {
      node {
        title
        path
        conference
        datetime
        place
      }
    }
  }
}
</page-query>
```

`Graphqlを再反映させる為に、開発中はschemaを変えた際必ず gridsome developを実行します`  
僕はここで無駄に時間を食いました

これで`survey`ディレクトリ内にあるMarkdownのカンファレンスへのリンクが  
自動生成される様になりました

## アンケート詳細Surveyページ作成

アンケート詳細であるSurveyページを作成します。  
先程のコーディングで`survey/phperkaigi2020/`のリンクが出来ました。  
このURLに応答するTemplateを作成します。

[Templates](https://gridsome.org/docs/templates/)を見ながら`gatsby-config.js`を再修正

```javascript:title=gatsby-config.js
module.exports = {
  siteName: 'survey.seike460.com',
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'survey/*.md',
        typeName: 'SurveyPage',
      },
      templates: {
        SurveyPage: '/survey/:conference'
      }
    }
  ]
}
```

`/survey/:conference`に対するTemplateの`src/templates/SurveyPage.vue`を作成します。

```javascript:title=src/templates/SurveyPage.vue
<template>
  <Layout>
    <hr>
    <div class="article">
      <h2 v-html="$page.surveyPage.conference"/></h3>
      <ul>
         <li><h3>タイトル</h3></li>
        <ul>
          <li v-html="$page.surveyPage.title"/>
        </ul>
        <li><h3>発表時間</h3></li>
        <ul>
          <li v-html="$page.surveyPage.datetime"/>
        </ul>
        <li><h3>場所</h3></li>
        <ul>
          <li v-html="$page.surveyPage.place"/>
        </ul>
      </ul>
      <h3>プロポーザル</h3>
      <div v-html="$page.surveyPage.content"/></div>
    </div>
  </Layout>
</template>

<style>
.article {
  margin: 1rem;
}
</style>

<page-query>
query posts ($path: String!) {
  surveyPage (path: $path) {
    title
    conference
    datetime
    place
    content
  }
}
</page-query>
```

これでひとまず一覧と詳細ページを作成完了しました。  
一覧の日付でのソートを忘れてたな〜と思いながら、また今度にします。

[対象のPR](https://github.com/seike460/survey.seike460.com/pull/2)はこちらです。

プレゼンテーション層は用意できたので、ここにFormを追加して、  
実際にロジック層へ入力を渡していきます。
