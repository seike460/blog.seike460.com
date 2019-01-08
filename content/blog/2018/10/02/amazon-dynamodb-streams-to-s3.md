---
title: Amazon DynamoDB Streamsから取得したデータをS3に保存する
date: 2018-10-02
tags: ["dynamoDB", "Go"]
---

[元記事](https://tech.fusic.co.jp/cloud/amazon-dynamodb-streams-to-s3/)

DynamoDBにデータが登録された際に、登録されたデータを解析にかけたい事などあると思います

DynamoDBにデータがあると解析し辛いのでDataLakeとしてS3を利用するために  
Amazon DynamoDB StreamsからS3にデータ保存を行う方法を考えます

まずはDynamoDB Streamsを有効化します。

![amazon-dynamodb-streams-to-s3-1](/amazon-dynamodb-streams-to-s3-1.png)

今回はシンプルな仕組みにしたいので、新しいデータのみストリームに流すようにします

![amazon-dynamodb-streams-to-s3-2](/amazon-dynamodb-streams-to-s3-2.png)

次にトリガーを作成してDynamoDBへの書き込み時にそのStreamデータを入力にLambdaを起動するように設定します。

![amazon-dynamodb-streams-to-s3-3](/amazon-dynamodb-streams-to-s3-3.png)

あとはStreamデータをJsonにして保存するだけでOKです

以下の用にチャッチャと書いていきます。

```go:title=main.go
package main

import (
        "bytes"
        "context"
        "encoding/json"

        "github.com/aws/aws-lambda-go/events"
        "github.com/aws/aws-lambda-go/lambda"
        "github.com/aws/aws-sdk-go/aws"
        "github.com/aws/aws-sdk-go/aws/endpoints"
        "github.com/aws/aws-sdk-go/aws/session"
        "github.com/aws/aws-sdk-go/service/s3"
)

// Handler lambda
func Handler(ctx context.Context, e events.DynamoDBEvent) error {
        for _, record := range e.Records {
                bucket := "seike460"
                s, _ := json.Marshal(record.Change.NewImage)
                key := record.EventID + ".json"
                sess := session.Must(session.NewSession(&aws.Config{
                        Region: aws.String(endpoints.ApNortheast1RegionID),
                }))
                svc := s3.New(sess)
                svc.PutObject(&s3.PutObjectInput{
                        Body:                 bytes.NewReader(s),
                        Bucket:               aws.String(bucket),
                        Key:                  aws.String(key),
                        ACL:                  aws.String("private"),
                        ServerSideEncryption: aws.String("AES256"),
                })
                return nil
        }
        return nil
}

func main() {
        lambda.Start(Handler)
}
```

S3に保存出来ました！
これでS3に貯めたデータをAthena経由でQuickSightに可視出来ますね！
