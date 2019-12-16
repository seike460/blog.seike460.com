---
date: "2019-12-11"
tags: ["PHP", "AWS", "Lambda", "VPC", "Serverless Framework"]
title: "AWS Lambda With RDS Proxy Performance"
---

この記事は[AWS LambdaとServerless #1 Advent Calendar 2019](https://qiita.com/advent-calendar/2019/lambda)の11日目 です  
[Fusic Tech blog](https://tech.fusic.co.jp/posts/2019-12-11-aws-lambda-with-rds-proxy-performance-1/) に書いたものと同じ記事です  
11月末にLaravel on Lambda With RDSのパフォーマンスを測定するということをやってみたのですが、  
12月頭に[using-amazon-rds-proxy-with-aws-lambda](https://aws.amazon.com/jp/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/)が発表されました。

環境も残っているし、サクッとパフォーマンス比較を行なってみます

試した環境は以下の通りで、プログラムも非常に単純なものにしました。  
ただデータベースからデータをSELECTして終わりという非常に単純なものです。

```php
public function index()
{
    User::all();
    return view('home');
}
```

RDSはdb.m5.largeのデフォルトの物を利用します。

```php
We currently support Amazon RDS MySQL or Aurora MySQL, running on MySQL versions 5.6 or 5.7
```

max_connectionsでConnection自体は潤沢にあります  
SELECTするデータ数は10000件用意しました。

```sql
MySQL [(none)]> SHOW GLOBAL VARIABLES like 'max_connections';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_connections | 624   |
+-----------------+-------+

MySQL [laravel]> select count(*) from users;
+----------+
| count(*) |
+----------+
|    10000 |
+----------+
```

この状態で1000リクエストを100クライアントで実行します。  
コールドスタート考慮して、とりあえず3回やります。

```bash
$ ab -n 1000 -c 100 https://seike460.execute-api.ap-northeast-1.amazonaws.com/dev/
```

## Proxyなし

```bash
Requests per second:    81.51 [#/sec] (mean)
Requests per second:    120.02 [#/sec] (mean)
Requests per second:    120.76 [#/sec] (mean)
```

大体120 [#/sec]ですね。

## RDS Proxy版

RDS Proxy設定していきます。

Serverless FrameworkのDocsとGithub見たけどまだそれらしい設定はわかりませんでした。
全てが[ココ](https://aws.amazon.com/jp/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/)に書いてあるので、ポチポチボタンを押していきます

最終的に、RDS Proxyのエンドポイントが作成されるので、
Lambda Laravelの繋ぎ先をRDS Proxyに変更します。

```bash
Requests per second:    31.88 [#/sec] (mean)
Requests per second:    33.27 [#/sec] (mean)
Requests per second:    33.30 [#/sec] (mean)
```

大体33 [#/sec]ですね。。。
実際にApache Benntiを書けてみるとわかるのですが、
Finished 1000 requests前で動作がとまり、  
かなり時間が立った後に結果がかえります。

多数のLambdaがConnectionの解放待ちを行なっている状態だと考えます。

ココでRDSの接続数を見てみます。

![](https://tech.fusic.co.jp/uploads/rdsconnection.png)

ある期間から接続数が急激に上昇し、その接続数が保たれています。  
Connection Poolingが行われている様子だと思います。

リクエストの分布を見てみると、何度測定しても次の様な結果が得られます。

```bash
Percentage of the requests served within a certain time (ms)
  50%    754
  66%    799
  75%    829
  80%    844
  90%    903
  95%    986
  98%   1040
  99%   1065
 100%  28172 (longest request)
```

最後のリクエストの完了に以上に時間がかかっています。  
やはりリクエストを受け取る事ができるけど、  
Connectionが回ってくるのに時間がかかっているようです。  

## まとめ

爆発的なリクエストの増加には、少し厳しいレスポンスになることがわかりました。  
ある意味当たり前かつこれが狙った効果ではあるので、  
Connectionを溢れさせない為には有用だと思います。

使うポイントを間違えなければ、Lambdaで有効に使える機能だと考えました。
