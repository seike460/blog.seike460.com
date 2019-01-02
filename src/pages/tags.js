import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

import { rhythm } from '../utils/typography'

class TagsPage extends React.Component {
  render() {
    const { data } = this.props
      console.log(this)
    const siteTitle = data.site.siteMetadata.title
    const group = data.allMarkdownRemark.group

    return (
      <Layout location="tags" title={siteTitle}>
        <Seo
          title="blog.seike460.com"
          keywords={[`seike460`, `gatsby`, `fusic`]}
        />
        <h2>tags</h2>
        {group.map(({ fieldValue, totalCount }) => {
          const tagLink = "tags/" + fieldValue
          return (
            <div key={fieldValue}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={tagLink}>
                  {fieldValue} ({totalCount})
                </Link>
              </h3>
              <hr />
            </div>
          )
        })}
        <Bio />
      </Layout>
    )
  }
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___tags], order: DESC }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
