// Core
import React from 'react'
import { graphql } from "gatsby"

// components
import PostLink from "../components/post-link"
import Layout from '../components/layout'
import SEO from '../components/seo'

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  const Posts = edges
    .filter(edge => !!edge.node.frontmatter.date)
    .map(edge => <PostLink key={edge.node.id} post={edge.node} />)

    return <Layout>
    <SEO title="Home" keywords={[`seike460`, `@seike460`, `せいけしろー`, `清家史郎`]} />
    <h2>このブログに関して</h2>
    <p>技術の事とどうでもインフォメーションを書きます</p>
    <h2>Post</h2>
    <div>{Posts}</div>
  </Layout>
}

export default IndexPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
      edges {
        node {
          id
          excerpt(pruneLength: 250)
          frontmatter {
            date(formatString: "YYYY/MM/DD")
            path
            title
          }
        }
      }
    }
  }
`
