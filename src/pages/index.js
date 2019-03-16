import React from 'react'
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

import { FaClock } from 'react-icons/fa';
import { FaTags } from 'react-icons/fa';

import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Seo
          title="blog.seike460.com"
          keywords={[`seike460`, `gatsby`, `fusic`]}
        />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small><FaClock />{node.frontmatter.date} <FaTags />{node.frontmatter.tags.map((tag, id) => {
                const tagsPath = "tags/" + tag
                return (
                    <span key={id}>&nbsp;<Link to={tagsPath}>{tag}</Link>&nbsp;</span>
                )
              })}
              </small>
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <hr />
            </div>
          )
        })}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "YYYY/MM/DD")
            title
            tags
          }
        }
      }
    }
  }
`
