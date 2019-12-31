---
title: 'Serverlessのメリットを言語化する'
date: 2019-12-24
tags:
  - Serverless
---

本記事は[Serverless Advent Calendar 2019](https://adventar.org/calendars/4360)の24日目の記事  
および[Fusic その2 Advent Calendar 2019](https://qiita.com/advent-calendar/2019/fusic-2)の24日目の記事です。

今回は、ServerlessのメリットをAWS Lambbdaを例に言語化したいと思います。

AWS LambdaのBlackbeltでは以下の様な目線で語られています

- インフラのプロビジョニング、管理が不要
- 自動でスケール
- 価値に対する支払い
- 高可用かつ安全

こちらをもうすこし掘り下げて言語化します。

## インフラのプロビジョニング、管理が不要

インフラのプロビジョニングとは、必要に応じてネットワークやコンピューターの設備などの  
リソースを提供できるよう予測し、準備しておくことです

通常私達がアプリケーションを提供する為には様々な機器が必要になります。  
それらの機器をアプリケーションの特性に応じて予め準備する事が必要です。

ここだけ聞くと、EC2等の仮想サーバーを用意すれば問題なさそうですが、  
それすら私達はオートスケールさせる為のインフラを構築、管理が必要となります

そのインフラはさらにセキュリティアップデート等のインフラを維持するためのコストを  
私達は見込まねばなりません。

それらのインフラを意識しなければならない状況から、  
解放してくれるのがサーバーレスです

## 自動でスケール

インフラの管理でも触れましたが、私達はオートスケールをクラウドベンダーに任せる事が出来ます

リクエスト数に応じてサーバーレスの関数が自動でスケールを行い、  
私達がインターネットのスパイクアクセスに怯える必要はなくなります

サーバーレスを導入する事で、インフラのスケール計画から解放されます

## 価値に対する支払い

サーバーレスはコストメリットも提供します

基本利用料などは存在せず、利用した事実に対する課金が発生します  
日中のみしかアクセスが無いようなサービスでは、夜間の待機コストを削減出来る為、  
非常にコスト効率がよいアプリケーションを提供する事が出来ます

ここで、注意したいのが大量のアクセスを捌けてしまうため、  
超巨大なアクセスが来た際に、それに対するコストを支払わなければならない可能性もあるということです。  

ただし、概ねリクエストを処理しなくて良い状況はあまりないため、  
しっかりアクセスに対する計画を立てて、費用を意識することは通常のサーバーフルな状況と変わりません。

不要なコストから解放される事のメリットの方が大きいと考えます。

## 高可用かつ安全

クラウドベンダーのインフラ上で動作するため、レプリケーションと冗長化は高いレベルで実現されています。  
少なくとも自分たちでインフラを構築するよりは、冗長性は高いと言えるでしょう。

それ以上に物理機器のメンテナンスさえ、クラウドベンダーに任せる事が出来ます

また、セキュリティパッチ等の適用も早いため、自分たちで情報をウォッチして、  
一台一台セキュリティパッチの適用を行うよりかも遥かに安全だと考えれます。

僕たちはサーバーの保守から解放される事が出来ます

## まとめ

僕たちはプログラマーが本来提供したいのはアプリケーションであり、インフラではありません。  
なのでクラウドベンダーのサービスを利用している人が大量にいるのだと思います。

その答えの一つがサーバーレスであり、僕たちは価値の提供に集中することが出来ます。

一方で勘違いしたくないのが、僕たちが行いたいのはサーバーレスを届ける事では無いということです。  
サーバーレスは、今現在その構成を取るだけで価値を提供出来ますが、  
結局その上で動作するアプリケーションの価値を高めるアーキテクチャであり、  
本来の価値はそのアプリケーション自身にあります

サーバーレスの考え方以上の価値を提供するものがあるなら、  
その上でアプリケーションを動作させる方が価値が高いアプリケーションを提供

非常に価値の高いアーキテクチャだと信じている為、これからも利用、コミットを続けようと思いますが  
一方で本当の目的である、アプリケーションで価値を届けることを忘れないようにしないといけません。