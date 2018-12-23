<template>
  <Layout>
    <h2>このサイトについて</h2>
    <p>普段調べた技術のことや、どうでもインフォメーションを書きます</p>
    <h2>書いたやつ</h2>
    <div v-for="item in $page.allPost.edges">
      <p>{{item.node.month}}月{{item.node.day}}日</p>
      <p>{{item.node.category}}</p>
      <g-link :to="item.node.path"><span class="square_btn">{{ item.node.title }}</span></g-link>
    </div>
  </Layout>
</template>

<script>
  export default {}
</script>

<page-query>
query posts {
  allPost {
    edges {
      node {
        path
        title
        month
        day
        category
      }
    }
  }
}
</page-query>
