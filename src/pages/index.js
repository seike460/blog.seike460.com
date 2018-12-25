import React from 'react'
import { graphql } from "gatsby"

import PostLink from "../components/post-link"
import Layout from '../components/layout'
import SEO from '../components/seo'

import logo from '../../static/common/seike460.jpg'

const IndexPage = ({
  data: {
    allMarkdownRemark: { edges },
  },
}) => {
  const Posts = edges
    .filter(edge => !!edge.node.frontmatter.date) // You can filter your posts based on some criteria
    .map(edge => <PostLink key={edge.node.id} post={edge.node} />)

    return <Layout>
    <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
    <h1>blog.seike460.com</h1>
    <p>技術の事とどうでもインフォメーションを書きます</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <img src={logo} alt="logo" />
    </div>
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
            date(formatString: "MMMM DD, YYYY")
            path
            title
          }
        }
      }
    }
  }
`
