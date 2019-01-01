import React from 'react'
import PropTypes from "prop-types"
import { Link, graphql } from 'gatsby'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import Seo from '../components/Seo'

import { rhythm, scale } from '../utils/typography'



const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
      <Layout location={tagHeader} title='blog.seike460.com'>
        <Seo
          title={tag}
          description={tag}
          keywords={[tag]}
        />
        <h1>Tags : {tag}</h1>
        <ul>
          {edges.map(({ node }) => {
            const title = node.frontmatter.title
            const slug = node.fields.slug
            const excerpt = node.excerpt
            return (
            <div key={slug}>
              <h3 style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link to={slug}>{title}</Link>
              </h3>
              <p dangerouslySetInnerHTML={{ __html: excerpt }} />
            </div>
            )
          })}
        </ul>
      </Layout>
  )
}

Tags.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      totalCount: PropTypes.number.isRequired,
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              slug: PropTypes.string.isRequired,
              title: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
