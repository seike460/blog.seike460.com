---
title: tideways_xhprofを利用したPHPパフォーマンスプロファイリング
date: 2018-10-30
tags: ["php"]
---

ISUCON8で予選敗退して悔しい思いをしたので最近プログラムのパフォーマンスについて考えています  
今回はPHPのプロファイリング出来るツールについてまとめます

PHP5の頃からxhprofと呼ばれるパフォーマンスプロファイリングツール使っていたのですが、  
PHP7では本家のものが利用できないみたいですので、tideways_xhprofを利用します

## PHP7.2インストール

とりあえずPHP7.2をインストール、利用OSはAmazon Linux2です  
phpizeが欲しいので、php-develをいれます

```
$ sudo yum update
$ sudo amazon-linux-extras install php7.2
$ sudo yum install php-devel
```

## tideways_xhprofインストール

```
$ sudo yum install git
$ git clone https://github.com/tideways/php-xhprof-extension
$ cd php-xhprof-extension
$ phpize
$ ./configure
$ make
$ sudo make install
```

php.iniに設定

```
$ sudo vim /etc/php.ini
```

以下を追記

```
extension=tideways_xhprof.so
```

## 使い方

計測したい範囲で以下関数を呼び出します。

- プロファイリング開始関数
    - `tideways_xhprof_enable();`
- プロファイリング終了関数
    - `tideways_xhprof_disable();`

`tideways_xhprof_disable`に関してはスクリプト終了時とかに呼びたいので、  
`register_shutdown_function`とかに引っ掛けるのが良いんじゃないのかなと思います

`auto_prepend_file`とかに設定するのが便利何じゃないかと思います

今回は手抜きします

## コード

```php:title=hoge.php
<?php

function hoge($i)
{
    echo 'hoge' . $i;
}

function saveXhprofData()
{
    $savePath = uniqid() . 'seike460.xhprof';
    $data = tideways_xhprof_disable();
    file_put_contents(
        $savePath,
        json_encode($data)
    );
}

// プロファイリング開始
tideways_xhprof_enable();

// スクリプト終了時にデータ保存する関数
register_shutdown_function('saveXhprofData');

$i=1;
while ($i < 100) {
    hoge($i);
    $i++;
}
```

## 実行

```
$ php xhprof.php
```

実行するとファイルが作成されます。
今回の場合以下ファイル名でした。
```
5bd7e95b34f23.seike460.xhprof
```

このファイルを解析します。

## 解析ツール
xhprofが提供している公式の解析ツールがあるのですが、  
諸々めんどくさいのでtidewaysが提供しているtoolkitを利用します。

Goなのでサクッと導入

```
$ sudo amazon-linux-extras install  golang1.9
$ yum install golang
$ go get github.com/tideways/toolkit
```

パスも設定しておきます

```
$ vim ~/.bash_profile
```
以下を追記

```
PATH='~/go/bin':$PATH
```
あとは生成されたファイルを指定してあげれば結果が表示されます。

```
$ toolkit analyze-xhprof 5bd7e95b34f23.seike460.xhprof
+----------+-------+-----------+------------------------------+
| FUNCTION | COUNT | WALL-TIME | EXCL  WALL-TIME (>= 0.01 MS) |
+----------+-------+-----------+------------------------------+
| hoge     |    99 | 0.14 ms   | 0.14 ms                      |
| main()   |     1 | 0.17 ms   | 0.03 ms                      |
+----------+-------+-----------+------------------------------+
```

## 可視化
公式xhprofの頃もあったのですがgraphvizを利用すればいい感じに描画してくれます。

```
$ sudo yum install graphviz
```
これもtoolkit経由で実行

```
$ toolkit generate-xhprof-graphviz 5bd7e95b34f23.seike460.xhprof
$ dot -Tpng callgraph.dot > callgraph.png
```

![callgraph.png](/callgraph.png)

これでPHPの関数に関して、何が悪いのかしっかり計測して評価していけますね！


