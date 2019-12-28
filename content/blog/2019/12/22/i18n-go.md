---
title: 'golang.org/x/text/message でi18n対応を行う'
date: 2019-12-22
tags:
  - Go
  - i18n
  - s3ry
---

本記事は[Go2 Advent Calendar 2019](https://qiita.com/advent-calendar/2019/go2)の22日目の記事
および[Fusic Advent Calendar](https://qiita.com/advent-calendar/2019/fusic)の22日目の記事です。

今回はずっと放置していた[s3ry](https://github.com/seike460/s3ry)のi18n対応を実際に行なってみようと思います

この記事は[Fusic Tech Blog](https://tech.fusic.co.jp/posts/2019-12-22-i18n-go/)に投稿したものと同じものです

## s3ry

s3ryについては次の記事をご覧ください。  
[Go製S3クライアントS3ry](https://tech.fusic.co.jp/posts/s3rypoweredbygo/)

要はちょっと便利なS3の操作クライアントです

## golang.org/x/text/message

Go準標準パッケージ内にある、国際化のためのパッケージです。  
こちらを利用した実際のi18n対応を行なっていきたいと思います

message.NewPrinter を利用して、出力を調整していきます 
環境変数 LANGを読み取って、"ja_JP.UTF-8"が指定されている場合は日本語 
それ以外が指定されている場合は英語で出力する事にします

i18n.goを利用して、こちらに多言語メッセージを作成していきます

```go

package s3ry

import (
	"os"

	"golang.org/x/text/language"
	"golang.org/x/text/message"
)

// i18nPrinter i18n
var i18nPrinter = message.NewPrinter(language.English)

func init() {

	if os.Getenv("LANG") != "ja_JP.UTF-8" {
		return
	}

	i18nPrinter = message.NewPrinter(language.Japanese)

	message.SetString(language.Japanese,
		"Which bucket do you use?",
		"どのbucketを利用しますか?")

    ~ 省略 ~

}

```

メッセージを出力する側はメッセージをi18nPrinter.Sprintfに変更していきます

```go
// SelectBucketAndRegion get Region and Bucket
func SelectBucketAndRegion() (string, string) {

    // for Bucket Search
    s3ry := NewS3ry(ApNortheastOne)
    // show Bucket List & select
    buckets := s3ry.ListBuckets()
    selectBucket := s3ry.SelectItem(i18nPrinter.Sprintf("Which bucket do you use?"), buckets)
    ctx := context.Background()
    // Get bucket's region
    region, err := s3manager.GetBucketRegion(ctx, s3ry.Sess, selectBucket, ApNortheastOne)
    if err != nil {
        awsErrorPrint(err)
    }
    return region, selectBucket
}
```

これで ja_JP.UTF-8 がLANGに設定されている場合は、日本語のメッセージに  
それ以外は英語で出力される様になりました

実際の修正のPull Requestはこちらです

- [i18n](https://github.com/seike460/s3ry/pull/30)

## まとめ

Goでi18n対応行なってみました。  
少し煩雑さを感じたので、golang.org/x/text/messageを利用した別の方法や  
golang.org/x/text/messageを利用した他の方法を模索してみようと思います

明日の[Go2 Advent Calendar 2019](https://qiita.com/advent-calendar/2019/go2)は[@guregu](https://qiita.com/guregu)さんです。ご期待ください！

## 参考文献

- [golang.org/x/text/message](https://godoc.org/golang.org/x/text/message)
- [golang.org/x/text/messageでI18N](https://ymotongpoo.hatenablog.com/entry/2018/12/25/163455)
