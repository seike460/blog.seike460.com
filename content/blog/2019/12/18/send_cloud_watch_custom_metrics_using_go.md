---
title: 'Cloud Watch Custom MetricsをGoで送信する'
date: "2019-12-18"
tags:
  - Go
  - CloudWatch
  - Custom Metrics
---

本記事は、[Fusic Advent Calendar その２](https://qiita.com/advent-calendar/2019/fusic-2)の18日目の記事です。

昨日の記事は、[@NaoyaMiyagawa](https://qiita.com/NaoyaMiyagawa) による[新卒がこの半年+αでもらったレビューを振り返る](https://qiita.com/NaoyaMiyagawa/items/c6bbc5784dcab02f1b47)でした。  
レビューの振り返り、ちゃんと言語化して理解できているのかに良いかもですね  
おっさんがこの1年でもらったレビューを振り返るとかも面白そうですね

今回はCloudWatchのCustom MetricsをGoを使って送信してみます

この記事は[Fusic Tech Blog](https://tech.fusic.co.jp/posts/2019-12-18-send-cloud-watch-custom-metrics-using-go/)に投稿したものと同じものです

## 送信するものを取得

今回は[shirou/gopsutil](https://github.com/shirou/gopsutil)を使ってClientのリソース状況取得して、  
それをSQS経由でCloudWatchに送信します。

SQSを挟んでるのは、かなり高頻度にデータを送信する予定だったためです

```go
package fbresource

import (
	"time"

	"github.com/fictionbase/fictionbase"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/load"
	"github.com/shirou/gopsutil/mem"
)

// FictionBase struct
type FictionBase struct {
	Message Resources `json:"message"`
}

// Resources struct
type Resources struct {
	fictionbase.MessageBase
	Memory  *mem.VirtualMemoryStat `json:"memory"`
	CPU     []cpu.InfoStat         `json:"cpu"`
	LoadAvg *load.AvgStat          `json:"load_avg"`
	Host    *host.InfoStat         `json:"host"`
	Disk    *disk.UsageStat        `json:"disk"`
}

// Run GetResource And Send SQS
func (fb *FictionBase) Run() {
	var err error
	fb.Message.TypeKey = "fbresource"
	fb.Message.StorageKey = "cloudwatch"
	for {
		time.Sleep(1 * time.Second)

		fb = getResources(fb)

		err = fictionbase.SendFictionbaseMessage(fb)
		if err != nil {
			fictionbase.Logger.Error(err.Error())
		}
	}
}

func getResources(fb *FictionBase) *FictionBase {
	var err error
	fb.Message.Memory, err = mem.VirtualMemory()
	if err != nil {
		fictionbase.Logger.Error(err.Error())
		fb.Message.Memory = nil
	}
	// CPU
	fb.Message.CPU, err = cpu.Info()
	if err != nil {
		fictionbase.Logger.Error(err.Error())
		fb.Message.CPU = nil
	}
	// LoadAvg
	fb.Message.LoadAvg, err = load.Avg()
	if err != nil {
		fictionbase.Logger.Error(err.Error())
		fb.Message.LoadAvg = nil
	}
	// Host
	fb.Message.Host, err = host.Info()
	if err != nil {
		fictionbase.Logger.Error(err.Error())
		fb.Message.Host = nil
	}
	// Disk
	fb.Message.Disk, err = disk.Usage("/")
	if err != nil {
		fictionbase.Logger.Error(err.Error())
		fb.Message.Disk = nil
	}
	// Set Time
	fb.Message.TimeKey = time.Now()
	return fb
}
```

Run() で 1秒ごとにgetResources()を呼び送信用のTypeであるResourceを作成します  
それを fictionbase.SendFictionbaseMessage でSQSに向けて送信します

## SQSへの送信

ここでは、先程取得した物を愚直にSQSのエンドポイントに送信するだけです

```go
// SendFictionbaseMessage Send Message To FictionBase
func SendFictionbaseMessage(fb interface{}) (err error) {
	jsonByte, err := json.Marshal(fb)
	if err != nil {
		return err
	}
	req, err := http.NewRequest(
		"POST",
		viper.GetString("sqs.url"),
		strings.NewReader(string(jsonByte)),
	)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "Content-Type:application/json")
	client := &http.Client{}
	_, err = client.Do(req)
	if err != nil {
		return err
	}
	return nil
}
```

先程取得したTypeを interfaceを引数にとって受け取り、SQSのエンドポイントに送信します  
これでSQSにデータ送信出来たので、SQSからデータを取得してCloudWatchに送信します

## CloudWatch

SQSからデータを受信しながら、CloudWatchに送信します  
本アプリケーションではリソースチェックの他にHTTPのチェックも行なっていたので、  
今回はリソースだけに注目します

```go
func main() {
	sq = fictionbase.NewSqs()
	cw = fictionbase.NewCw()
	var typeChecker typeChecker

	logger := fictionbase.GetLogger()

	for {
		messages, err = sq.GetFictionbaseMessage()
		if err != nil {
			logger.Error(err.Error())
			return
		}
		// Get All SQS Data
		if len(messages) == 0 {
			return
		}
		for _, m := range messages {
			wg.Add(1)
			go func(m *sqs.Message) {
				defer wg.Done()
				err = json.Unmarshal([]byte(*m.Body), &typeChecker)
				if err != nil {
					logger.Error(err.Error())
					return
				}
				if typeChecker.TypeKey == "fbresource.Resources" {
					SetFbresource(m)
					return
				}
				if typeChecker.TypeKey == "fbhttp.HTTP" {
					SetFbHTTP(m)
					return
				}
			}(m)
		}
		wg.Wait()
	}
}

// SetFbresource Set For fbresource
func SetFbresource(message *sqs.Message) {
	var sqsData fbresource.Resources
	err := json.Unmarshal([]byte(*message.Body), &sqsData)
	if err != nil {
		logger.Error(err.Error())
		return
	}
	dimensionParam := &cloudwatch.Dimension{
		Name:  aws.String("Hostname"),
		Value: aws.String(sqsData.Host.Hostname),
	}
	metricDataParam := &cloudwatch.MetricDatum{
		Dimensions:        []*cloudwatch.Dimension{dimensionParam},
		MetricName:        aws.String("DiskUsage"),
		Timestamp:         &sqsData.TimeKey,
		Unit:              aws.String("Percent"),
		Value:             aws.Float64(sqsData.Disk.UsedPercent),
		StorageResolution: aws.Int64(1),
	}
	putMetricDataInput := &cloudwatch.PutMetricDataInput{
		MetricData: []*cloudwatch.MetricDatum{metricDataParam},
		Namespace:  aws.String("EC2"),
	}
	err = cw.SendCloudWatch(putMetricDataInput)
	if err != nil {
		logger.Error(err.Error())
		return
	}
	sq.DeleteFictionbaseMessage(message)
	if err != nil {
		logger.Error(err.Error())
		return
	}
}
```

SQSにはそれなりに大量のデータが溜まっているので、goroutineを発行しながら実行します  
Timeを送信元にもたせているので、時系列がおかしくなることはありません

sq.GetFictionbaseMessage()でSQSからデータを取得して、SetFbresourceでデータを送信します  
PutMetricDataInputを生成して、CloudWatchのSendCloudWatch()を呼べば完了です

## まとめ

GoでCustom Metricsを送信してみました  
いろんな物をお手軽に時系列データに出来るので、是非試してみましょう

明日のFusic Advent Calendar その２は[tutida](https://qiita.com/tutida)が担当です。ご期待ください
