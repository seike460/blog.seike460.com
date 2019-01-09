---
title: AWS Lambda と goroutine
date: 2018-10-10
tags: ["lambda", "Go"]
---

[元記事](https://tech.fusic.co.jp/cloud/aws-lambda-and-goroutine/)

個人的に相性が良いと思っているAWS LambdaとGoについて書こうと思います。

Lambdaは実行時間等の関係もあり出来る限り小さく実装する必要があります。
Goは言語仕様により強制的に小さいアプリケーションになりやすいので相性が良いです。

またgoroutineでとても簡単に非同期処理を書けるため、
Lambdaが直接受け取るデータ以外はAPIを扱うLambdaとは相性が良いと考えています。

複数のicalデータを検索して予定が近づいたら
Slackに通知してくれるServerlessなアプリケーションを構築する例で考えてみます。

![utakata.png](/utakata.png)

①icalデータを取得
②icalデータをparseしてチェック
③通知範囲内にあればSlackに通知

上記の様になると思います。
この時①と③は外部からHTTPSでデータ取得及び送信をすることになります。

この処理を同期的に行うのは非効率なので、非同期的に処理改善を行なってみました。

- 同期処理
    - icalのデータを取得、チェック、Slack送信を直列処理で行った同期処理

```
var icalBody io.ReadCloser

for ical := range icals {
    //IcalデータをHTTPSで取得
    icalBody = getIcalData(ical)

    // icalチェックしてSlackに送信
    err := checkAndSlackSend(icalBody)
    if err != nil {
        return err
    }
}
```

- 非同期処理
    - icalのデータを取得を非同期
    - Slack送信を非同期

```
var icalBody io.ReadCloser

// 送信グループの作成①
wg := &sync.WaitGroup{}

for ical := range icals {

    // goroutine②
    go func(icalChan chan io.ReadCloser) {
        // IcalデータをHTTPSで取得
        icalChan <- getIcalData(ical)
    }(icalChan)

    // 待ちを追加③
    wg.Add(1)

    // icalチェックしてSlackに送信
    go func() {
        checkAndSlackSend(icalBody)
        wg.Done()  //送信完了④
    }()
    // Icalのデータを待ち受ける⑤
    icalBody = <-icalChan
}

// 最後の一回分
err := checkAndSlackSend(icalBody)
if err != nil {
    return err
}

// Slack送信の完了待ち⑥
wg.Wait()

```

- ① スレッド処理中にメインプロセスが終了しないようWaitGroup作成
- ② icalデータ取得をgoroutineで行ない、⑤で待受
- ③ Slack送信中にメインプロセスを待たせる為にWaitGroupを追加
※最初の１回目はgoroutineからデータを受け取っていないので必ず空振り
- ④Slack送信処理が完了したら追加したWaitGroupを減らす
- ⑤②で非同期取得したデータをchannel経由で取得
取得したicalを次のループで使用
- ⑥Slack送信中にメインプロセスが終了しないように待機
※ical取得は⑤で待ち受けているので必ず取得出来ます

AWS X-Rayにて処理実行時間を測定すると実行時間を減少された事が確認出来ました。
- utakata-single-utakata
    - 同期処理版
- utakata-goroutine-utakata
    - 非同期処理版

![amazon-dynamodb-streams-to-s3-1](/xray-utakata.png)

実際はAPI処理の偏りも結果に反映されているとはいえ、まずまずの結果になったと考えています。

今回はAWS外のデータ、APIを利用しましたがAWSサービスも、
基本的にAPIアクセスとなりますので十分に効果を発揮できると思います。

是非AWS LambdaとGoを利用してServerlessなアプリを構築してみてはいかがでしょうか。
