---
date: "2020-01-02"
tags: ["Serverless", "AWS"]
title: Serverless three tier architectures
---



[AWS サーバーレス 多層アーキテクチャ](https://d1.awsstatic.com/International/ja_JP/Whitepapers/AWS-Serverless-Multi-Tier-Architectures_JA.pdf)を元に、WEBアプリケーションエンジニアの目線で  
AWSにおけるサーバーレス3層アーキテクチャについて纏めます。


## 3層アプリケーション

プレゼンテーション層、ロジック層、データ層で構成されるアプリケーションです。

- プレゼンテーション層
    - ユーザーへからの入力、ユーザーへの出力等のインターフェイスを受け持つ
- ロジック層
    - 入力を元に、アプリケーション動作の制御を受け持つ
- データ層
    - ロジック層からの要求に応じてデータの保存、変更、削除、参照を受け持つ

この3層アプリケーションをサーバーレスにて実現します。

## プレゼンテーション層

ユーザーインターフェイスを提供する様々なクライアントが想定できます。

- ウェブサイトの静的コンテンツ
    - Amazon S3 や Amazon CloudFront 等で配信される静的コンテンツ
- モバイルアプリケーション
    - ユーザーデバイスにインストール済のモバイルアプリケーション
- クライアントデバイス
    - HTTP/HTTPSでアクセス可能なクライアント
        - [Amazon API GatewayはHTTP APIをサポートするようになりました](https://aws.amazon.com/jp/blogs/compute/announcing-http-apis-for-amazon-api-gateway/)

WEBアプリケーションエンジニアの目線ではウェブサイトの静的コンテンツから  
インターフェイスを提供する事が一般的では無いかと思います。

Amazon S3、Amazon CloudFrontが配信した静的コンテンツから、  
ロジック層へのエンドポイントへ接続するのをイメージです。

## ロジック層

プレゼンテーション層から渡される入力を受け取り、入力に応じた処理を行います。  
Amazon API Gateway と AWS Lambda を統合することで実現する事が多いです。

Application Load Balancer と AWS Lambda でも実行することは可能です。  
それぞれの違いがあるため、基本的にはユースケースに応じて選択をすることになります。

こちらに関しては有用な記事がありました。  
参考：[AWS Lambda：API GatewayとApplication Load Balancerの違い](https://qiita.com/unhurried/items/5a497ec81e4fefe22396)

特に厳しい要件が無ければ、Amazon API Gatewayを利用する事が良いように個人的には思えます。

Application Load BalancerやAmazon API Gatewayが入力を受け取り、  
AWS Lambdaが処理するのがロジック層の役割となります。

## データ層

ロジック層からの様々なデータストアが選択出来ます。

ロジック層の中核を担うAWS Lambdaから利用するデータストアは  
Amazon VPCにAWS Lambdaを展開するか否かで接続出来るデータストアが変わります。

### VPCに展開する場合

- Amazon RDS
- Amazon ElastiCache
- Amazon Redshift
- Amazon EC2

### VPCに展開しない場合

- Amazon DynamoDB
- Amazon S3
- Amazon Elasticsearch Service

AWS Lambdaから様々なデータストアを利用してロジックを作成し、  
サーバーレスなシステムを構築出来ます。

次回はこれらの3層を実際にサンプルアプリケーションとして構築してみようと思います。
