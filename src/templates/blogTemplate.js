import React from "react"
import { graphql } from "gatsby"

import Layout from '../components/layout'
import SEO from '../components/seo'

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { frontmatter, html } = markdownRemark
  return (
    <Layout>
      <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <div className="blog-post-container">
          <div className="blog-post">
            <h1>{frontmatter.title}</h1>
            <span>{frontmatter.date} : {frontmatter.tags}</span>
            <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </Layout>
  )
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "YYYY/MM/DD")
        path
        title
        tags
      }
    }
  }
`
