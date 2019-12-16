---
date: "2019-12-02"
tags: ["PHP", "AWS", "Lambda", "VPC", "Serverless Framework"]
title: "Lambda With RDS Provided Serverless Framework"
---

この記事は [Fusic Advent Calendar 2019](https://qiita.com/advent-calendar/2019/fusic) 2 日目の記事です。
[Fusic Tech blog](https://tech.fusic.co.jp/posts/2019-12-02-lambda-with-rds-serverless-framework/) に書いたものと同じ記事です

前回は[@k-masatany](https://twitter.com/k_masatany)のPHP on Lambdaな話でした。

折角ですので、SAM版ではないServerless Frameworkの例も踏まえつつ、  
PHPで使っていきたくなる、RDSに接続出来るVPC on Lambdaを作っていきます

## Serverless FrameworkでBref

これは簡単です。 (なぜなら[チュートリアル](https://bref.sh/docs/environment/serverless-yml.html)に書いてあるので  
従いまして各セクションの説明をしながら紹介します。

まずはinitを行うと[こちらのTemplate](https://github.com/brefphp/bref/tree/master/template)を利用した Serverless FrameworkのTemplateが出来ます。  
RDSに接続するHTTP関数を作成していきます

```bash:title=brefTemplate
$ vendor/bin/bref init
 What kind of lambda do you want to create? (you will be able to add more functions later by editing `serverless.yml`) [PHP function]:
  [0] PHP function
  [1] HTTP application
  [2] Console application
 > 1

Creating serverless.yml
Creating index.php


 [OK] Project initialized and ready to test or deploy.
```

ここで生成された serverless.yml を 解説しながらVPC上に配置する為のものに修正します。

```bash:title=before
service: app

provider:
    name: aws
    region: us-east-1
    runtime: provided

plugins:
    - ./vendor/bref/bref

functions:
    api:
        handler: index.php
        description: ''
        timeout: 28 # in seconds (API Gateway has a timeout of 29 seconds)
        layers:
            - ${bref:layer.php-73-fpm}
        events:
            -   http: 'ANY /'
            -   http: 'ANY /{proxy+}'
```

## 既存設定

### service
serviceはProjectのようなものです。
今回はseike460に変更します

### provider
ここで deployする provider(AWS)の設定を行います

#### name
BrefはAWS Lambbdaを利用するので aws 固定です。

#### region
配置するAWSリージョンです。僕は日本人なので日本に配置します

#### runtime
利用するruntimeの設定です。  
通常は go 等の利用する言語設定を行いますが  
brefでは provided を設定してカスタムランタイムを利用する設定にします

#### plugins
Serverless Frameworkを利用する上でのプラグインの設定です  
今回はbrefがpluginsにあたりますので、設定には初期値として設定されてます

### functions
実際の関数の設定を行います

#### api(任意値)
初期値では api が設定されてますが、これは関数名だと思ってください。  
任意の値を設定出来ます

#### description
その名の通り、関数の説明です。

#### timeout
その名の通り、関数のタイムアウト値です。  
Lambdaは実行時間課金ですので、サービスの特性に合わせて意志を持って設定を行いたい値です。

#### layers
利用するLambda Custom Layerです。  
brefはLambda Custom Layerを公開している為、それを利用させてもらいます。

#### events
動作するEventsのタイプを設定します。  
今回はHTTP Requestを利用して動作するLambdaを作成するので、 http を設定します。  
するとAPI Gatewayと紐付けられ、設定したHTTP Method と Path にて関数が動作します

cronの様に定期実行したい場合は [scheduled](https://serverless.com/framework/docs/providers/aws/events/schedule/) を設定します

ここまでが既存設定です  
続けてVPCに展開するための設定を追加していきます

### 追加設定

#### provider:iamRoleStatements

serverless frameworkには[default](https://serverless.com/framework/docs/providers/aws/guide/iam/#the-default-iam-role)のIAMRoleが設定されています。
そのIAMにVPCにLambdaを設定するために必要なENI系の設定を追加します、

#### functions:関数名:vpc:securityGroupIds

Lambdaに設定すべきセキュリティグループのID値を設定します。
Lambdaはこのセキュリティグループを元に動作します

#### functions:関数名:vpc:subnetIds

Lambdaに設定すべきsubnetのID値を設定します。
ここにLambdaが設置されるようになります。

結果次のようなYamlに変更されます

```bash:title=before
service:seike460

provider:
    name: aws
    region: ap-northeast-1
    runtime: provided
    iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "ec2:CreateNetworkInterface"
        - "ec2:DescribeNetworkInterfaces"
        - "ec2:DeleteNetworkInterface"
      Resource:
        - "*"

package:
    exclude:
        - '.git/**'

plugins:
    - ./vendor/bref/bref

functions:
    api:
        handler: public/index.php
        vpc:
          securityGroupIds:
            - sg-XxxxxxxxxxxxxxxxX
          subnetIds:
            - subnet-YyyyyyyyyyyyyyyyY
            - subnet-ZzzzzzzzzzzzzzzzZ
        description: ''
        timeout: 28 # in seconds (API Gateway has a timeout of 29 seconds)
        layers:
            - ${bref:layer.php-73-fpm}
        events:
            -   http: 'ANY /'
            -   http: 'ANY /{proxy+}'
```

これでPHPでもLambda With RDSな状況が出来ました

みなさんも是非 Serverless で サーバー管理から解放されましょう！

明日は [@gorogoroyasu](https://twitter.com/gorogoroyasu)です。  
機械学習の話か、Pythonの話か、はたまた謎の新技術の話か、正直社員でも予測が出来ません。  
お楽しみに！
