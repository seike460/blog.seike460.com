import Typography from 'typography'
import githubTheme from 'typography-theme-github'

githubTheme.overrideThemeStyles = () => {
  return {
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    '.gatsby-code-title': {
      'background': `skyblue`,
      'color': `black`,
      'margin-bottom': '-0.65em',
      'padding': '0.7rem 1.05rem',
      'font-size': '0.8em',
      'line-height': '0.2',
      'font-family': 'SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace',
      'font-weight': '600',
      'border-radius': '8px 8px 0 0',
      'display': 'table',
    }
  }
}

const typography = new Typography(githubTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
