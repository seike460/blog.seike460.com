<template>
  <Layout>
    <h1>seike460</h1>
    <p>色々書きます</p>
    <h2>記事</h2>
    <div v-for="item in $page.allPost.edges">
      <g-link :to="item.node.path">{{ item.node.title }}</g-link>
    </div>
  </Layout>
</template>

<script>
  export default {}
</script>

<page-query>
query posts {
  allPost{
    edges {
      node {
        path
        title
      }
    }
  }
}
</page-query>
