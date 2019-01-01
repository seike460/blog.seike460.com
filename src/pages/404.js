import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/Layout'
import Seo from '../components/Seo'

import { rhythm, scale } from '../utils/typography'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Layout location={this.props.location}>
        <Seo title="404: Not Found" />
        <h1
          style={{
            ...scale(1.5),
            marginBottom: rhythm(1.5),
            marginTop: 0,
          }}
        >
          <Link
            style={{
              boxShadow: `none`,
              textDecoration: `none`,
              color: `inherit`,
            }}
            to={`/`}
          >
        blog.seike460.com
        </Link>
      </h1>
      <h2>Not Found</h2>
      </Layout>
    )
  }
}

export default NotFoundPage
