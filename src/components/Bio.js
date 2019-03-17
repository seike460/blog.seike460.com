import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'
import Image from 'gatsby-image'


import { FaTags } from 'react-icons/fa';
import { FaChalkboardTeacher } from 'react-icons/fa';

import { rhythm } from '../utils/typography'

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <div
            style={{
              display: `flex`,
              marginRight: rhythm(1 / 2),
              marginBottom: rhythm(0.5),
            }}
          >
            <Image
              fixed={data.avatar.childImageSharp.fixed}
              alt={author}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
            />
            <div
              style={{
                marginTop: 15,
                marginRight: rhythm(1 / 2),
              }}
            >
              Written by <strong><a href={`https://twitter.com/${social.twitter}`}>{author}</a></strong>
            </div>
            <div
              style={{
                marginTop: 15,
                marginRight: rhythm(1 / 2),
              }}
            >
              <a href={`https://slide.seike460.com`}><FaChalkboardTeacher />TechSlides</a>
            </div>
            <div
              style={{
                marginTop: 15,
                marginRight: rhythm(1 / 2),
              }}
            >
              <Link to="tags"><FaTags />TagsList</Link>
            </div>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
        }
      }
    }
  }
`

export default Bio
