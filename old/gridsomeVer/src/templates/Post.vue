<template>
  <Layout>
    <h1>{{$page.post.title}}</h1>
    <h2>{{$page.post.month}}月{{$page.post.day}}日 カテゴリ: Serverless</h2>
    <div v-html="$page.post.content"/>
  </Layout>
</template>

<page-query>
query MarkdownPost ($path: String!) {
  post (path: $path) {
    title
    month
    day
    content
    category
  }
}
</page-query>

<script>
  export default {}
</script>
