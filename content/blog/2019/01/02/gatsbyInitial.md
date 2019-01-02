---
tags: ["gatsby"]
date: "2019-01-02"
title: gatsbyの初期設定忘備録
---

## この記事は？

gatsbyインストール後、Markdownなブログを開設するために初期設定した事の忘備録です  

gatsbyjsには starter なるものが用意されており、  
コレを利用すればかなりの機能を最初から提供してくれます

[Gatsby Starters](https://www.gatsbyjs.org/starters)

僕はその中からblogに最適だと思われる以下を利用しました

[gatsby-starter-blog](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-blog/)

正確には最初は~~何も考えず~~以下のstarterを利用していたのですが、blogに最適なやつにしたくて変更しました

[gatsby-starter-default](https://www.gatsbyjs.org/starters/gatsbyjs/gatsby-starter-default/)

### インストール

```bash
$ gatsby new blog.seike460.com https://github.com/gatsbyjs/gatsby-starter-blog
```

## siteMetadata設定

基本のメタ情報を設定します  
最初から存在するSEO Component(`src/components/seo.js`)に  
HTMLメタデータを設定してくれます

```javascript:title=gatsby-config.js example
siteMetadata: {
  title: `blog.seike460.com`,
  author: `@seike460`,
  description: `技術的な事とどうでもインフォメーションを書きます`,
  siteUrl: `https://blog.seike460.com`,
  social: {
    twitter: `seike460`,
  },
},
```

## google analytics設定

本来以下のプラグインを入れないといけないのですが、最初から入ってます

- gatsby-plugin-google-analytics

```javascript:title=gatsby-config.js example
{
  resolve: 'gatsby-plugin-google-analytics',
  options: {
    trackingId: 'UA-XxxxxxxX-Y',
  },
},
```

## Markdown

本来以下のプラグインを(ry

- gatsby-source-filesystem
- gatsby-transformer-remark

```javascript:title=gatsby-config.js example
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/blog`,
    name: `blog`,
  },
},
{
  resolve: `gatsby-source-filesystem`,
  options: {
    path: `${__dirname}/content/assets`,
    name: `assets`,
  },
},
```

blogディレクトリ配下にMarkdownファイルを作成する例です  
僕は一応`content/blog/YYYY/MM/hogehuga.md`単位でフォルダ分けをしています

このblog以下のパスはURLになります

- /YYYY/MM/hogehuga/

## 既存URLのリダイレクト

本来以下のプラグインを(ry

- gatsby-redirect-from
- gatsby-plugin-meta-redirect

`gatsby-plugin-meta-redirect` に関しては
// make sure this is always the last one
と書いてあるので最後に書いたほうが良さそうです

```javascript:title=gatsby-config.js example
'gatsby-redirect-from',
'gatsby-plugin-meta-redirect' // make sure this is always the last one
```

各mdファイルに`redirect_from`をつけます

---
tags: poem
date: "2019-01-01"
redirect_from:
  - /blog/poem/aspiration2019/
title: 2019年の抱負
---

上記の場合以下目標に飛んでくるURLを対象のmdファイルのブログポストにリダイレクト出来ます  

https://blog.seike460.com/blog/poem/aspiration2019/  
↓  
https://blog.seike460.com/2019/01/01/aspiration2019/  

## RSS

本来(ry

これはホント入れるだけで良いみたいです

## code Highlight

本来(ry

- gatsby-remark-prismjs

```javascript:title=gatsby-config.js example
{
resolve: `gatsby-remark-prismjs`,
  options: {
    classPrefix: "language-",
    inlineCodeMarker: null,
    aliases: {},
    showLineNumbers: false,
    noInlineHighlight: false,
  },
},
```

Highlightを実施するにはもうひと手間、gatsby-browser.jsに以下を追記
```javascript:title=gatsby-browser.js example
require("prismjs/themes/prism.css")
```

### 所感

設定簡単過ぎ

Pluginが豊富過ぎるので流石にGridsomeではなくてgatsbyで行こうかなーとか思ってます
