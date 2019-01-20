---
title: Serverless FrameworkでLambdaとS3を作成する
date: 2018-10-23
tags: ["serverless", "AWS"]
---

私がAWSのServerless環境を作成する時、基本的には[Serverless Framework](https://serverless.com/)を使います  
[AWS SAM](https://github.com/awslabs/serverless-application-model)でも良いのですが、Serverless Frameworkは開発が活発で便利なPluginも多く、  
機能追加も非常に早いためです。

インストールには`npm`か`yarm`を利用します

- npm
```
$ npm install serverless
```

- yarn
```
$ yarn add serverless
```

node_modules/serverless/bin/serverlessに実行ファイルがありますので、  
適宜パスを指定したり、 package.json の scripts に実行スクリプトを追加してください

serverlessコマンドを使ってテンプレートを作成します  
テンプレートに一覧は[こちら](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates)を御覧ください  
以下はGoのテンプレート(aws-go-dep)を利用しています  

```
$ serverless create --template aws-go-dep
```

すると、最低限の設定を行なったserverless.yml が作成されますので、修正していきます  
configをstageごとに分けたいので、別途用意したconfigファイルを参照するようにしています

[ドキュメントはこちら](https://serverless.com/framework/docs/providers/aws/guide/services/)

```yml:title=serverless.yml
service: Save2S3
provider:
  name: aws
  runtime: go1.x
  stage: ${opt:stage, 'dev'}
  region: ap-northeast-1
  timeout: 10
  cfLogs: true
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "s3:ListBucket"
        - "s3:GetObject"
        - "s3:PutObject"
        - "s3:DeleteObject"
      Resource:
        Fn::Join:
          - ""
          - - "arn:aws:s3:::"
            - ${self:provider.environment.Bucket}
            - "/*"
  environment:
    Bucket: ${file(config/${self:provider.stage}.json):Bucket}
        DebugMode: ${file(config/${self:provider.stage}.json):DebugMode}
package:
 exclude:
   - ./**
 include:
   - ./bin/**
functions:
  api:
    handler: bin/api
    events:
      - http:
          path: save2S3/{Action}
          method: post
resources:
  Resources:
    Bucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: ${self:provider.environment.Bucket}
```

```json:title=config/dev.json
{
    "Bucket":"seike460Save2S3",
    "DebugMode":"on"
}
```

あとはdeployコマンドを実行すればおしまいです  
CloudFormationをいい感じ作って、deployしてくれます  
Goで書いてる関係で、makeしています  
（Makeファイルはserverless frameworkが用意してくれます）

```
make && serverless deploy

Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (7.87 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...

…省略…

endpoints:

  POST - https://秘密.execute-api.ap-northeast-1.amazonaws.com/dev/save2S3/{Action}

Stack Outputs

…秘密…

Serverless: Removing old service versions...
Done in 78.62s.

```

とても簡単ですね。
Serverless Resourcesをチャッチャか作りたい時に Serverless Framework オススメです。
