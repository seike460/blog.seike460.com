module.exports = {
  siteName: 'blog.seike460.com',
  siteUrl: 'https://blog.seike460.com',
  siteDescription: '@seike460が普段調べた技術のことや、どうでもインフォメーションを書きます',
  titleTemplate: 'blog.seike460.com',
  transformers: {
    remark: {
      externalLinksTarget: '_blank',
      externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
      anchorClassName: 'icon icon-link',
      plugins: [
        // ...global plugins
      ]
    }
  },
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        path: 'blog/**/*.md',
        typeName: 'Post',
        remark: {
          plugins: [
            // ...local plugins
          ]
        }
      }
    }
  ]
}