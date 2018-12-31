import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

// images
import logo from '../../static/common/seike460.jpg'

const Header = ({ siteTitle }) => (
    <div
    style={{
      background: `dodgerblue`,
      marginBottom: `1.45rem`,
    }}
    >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          <img style={{ float: `left`, maxWidth: `50px`, marginBottom: `1.45rem` }} src={logo} alt="logo" />
          {siteTitle}
        </Link>
      </h1>
    </div>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
