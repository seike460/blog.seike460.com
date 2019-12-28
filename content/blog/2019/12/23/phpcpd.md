---
title: 'sebastianbergmann/phpcpdでコピペコードを撲滅する'
date: 2019-12-23
tags:
  - PHP
---

本記事は[PHP Advent Calendar 2019](https://qiita.com/advent-calendar/2019/php)の23日目の記事
および[Fusic Advent Calendar](https://qiita.com/advent-calendar/2019/fusic)の23日目の記事です。

以前[大改修！PHPレガシーコードビフォーアフター](https://phperkaigi.connpass.com/event/155509/)というイベントに参加した際に、  
[@blue_goheimochi](https://twitter.com/blue_goheimochi)さんが紹介してたphpcpdというツールが気になってたので、利用してみました

この記事は[Fusic Tech Blog](https://tech.fusic.co.jp/posts/2019-12-23-phpcpd/)に投稿したものと同じものです

## phpcpd

`phpcpd is a Copy/Paste Detector (CPD) for PHP code.`

コピペコードを見つけるツールです。  
同一コードは出来る限り無いほうが良いので是非実施してみましょう

## 素書のコードで試す

昔々、 line bot api framework として[lbaf](https://github.com/seike460/lbaf)といふもうを書きました。  
懐かしいですね（今は使い物にならないと思います

このコードはフレームワーク等を使わずに、全部素で書いたので、コピペ等存在しないはず

```
$ cd github.com/seike460/lbaf
$ phpcpd .
phpcpd 4.1.0 by Sebastian Bergmann.

No clones found.

Time: 38 ms, Memory: 4.00MB
```

コピペが検出されません。  
コピペが無いコードが良いわけではありませんが、健全なコードの指標にはなるかと思います。

## CakePHP3で書いたコードで試す

なんだかんだ、そんなに検出されないのでは？  
そう思った時代が僕にもありました。
CakePHP3で書いたコードで試してみます

```bash
phpcpd src
phpcpd 4.1.0 by Sebastian Bergmann.

Found 9 clones with 388 duplicated lines in 8 files:

  - 秘密のパス/src/Controller/秘密の.php:440-519 (79 lines)
    秘密のパス/src/Controller/秘密の.php:692-771

  - 秘密のパス/src/Controller/秘密の.php:235-289 (54 lines)
    秘密のパス/src/Controller/秘密の.php:409-463

  - 秘密のパス/src/Shell/秘密の.php:32-83 (51 lines)
    秘密のパス/src/Shell/秘密の.php:24-75

  - 秘密のパス/src/Shell/秘密の.php:32-78 (46 lines)
    秘密のパス/src/Shell/秘密の.php:25-71

  - 秘密のパス/src/Controller/秘密の.php:235-280 (45 lines)
    秘密のパス/src/Controller/秘密の.php:697-742

  - 秘密のパス/src/Controller/秘密の.php:56-93 (37 lines)
    秘密のパス/src/Controller/秘密の.php:138-175

  - 秘密のパス/src/Model/Table/秘密の.php:177-206 (29 lines)
    秘密のパス/src/Model/Table/秘密の.php:273-302

  - 秘密のパス/src/Controller/秘密の.php:395-420 (25 lines)
    秘密のパス/src/Controller/秘密の.php:486-511

  - 秘密のパス/src/Shell/秘密の.php:128-150 (22 lines)
    秘密のパス/src/Shell/秘密の.php:81-103

1.80% duplicated lines out of 21516 total lines of code.
Average size of duplication is 43 lines, largest clone has 79 of lines

Time: 310 ms, Memory: 18.00MB
```

これには正直自分でもビックリしました。  
こんな重複ある…？と  

ただ、表示されたパスを見ると、非常に思い当たる節がありました  
とても説明しにくいのですがアプリケーションの特性として、  
重複コードが発生しやすい構成になっています。  
それを頑張って重複しないようにしてたのですが、その共通化の漏れ部分と  
Shellに関してはいわゆるデータ移行用のShellで初期処理とか凄くコピペした覚えがありました...

該当の箇所を修正すると

```bash
phpcpd src
phpcpd 4.1.0 by Sebastian Bergmann.

Found 3 clones with 119 duplicated lines in 3 files:

  - 秘密のパス/src/Shell/秘密の.php:32-83 (51 lines)
    秘密のパス/src/Shell/秘密の.php:24-75

  - 秘密のパス/src/Shell/秘密の.php:32-78 (46 lines)
    秘密のパス/src/Shell/秘密の.php:25-71

  - 秘密のパス/src/Shell/秘密の.php:128-150 (22 lines)
    秘密のパス/src/Shell/秘密の.php:81-103

0.56% duplicated lines out of 21412 total lines of code.
Average size of duplication is 39 lines, largest clone has 51 of lines

Time: 315 ms, Memory: 18.00MB
```

動作テストしていないのでまだ反映は出来ないですが、該当の箇所はしっかり減りました  
Shellはどうしよう…もう使わないし削除しようかな…

## まとめ

phpcpdを利用して、重複コードのチェックを行なってみました。  
僕の場合は過去の悪事を暴かれてプロジェクトが健全な方向に進む一歩になったと考えます

身に覚えがある方、是非phpcpdを実行してみてはいかがでしょうか

明日の[PHP Advent Calendar 2019](https://qiita.com/advent-calendar/2019/php)は、なんと空白  
書いてみたい人は是非今からでもご応募ください
