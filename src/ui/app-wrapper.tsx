import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { XkitJs } from '@xkit-co/xkit.js'
import { Styled } from './scope-styles'
import {
  buildTheme,
  CatalogThemeProps,
  CatalogTheme,
  ThemeProvider
} from './theme'
import { Toaster } from './toaster'
import { Provider as XkitProvider } from './xkit-context'

interface AppWrapperProps {
  xkit: XkitJs,
  theme?: CatalogThemeProps
}

interface AppWrapperState {
  theme: CatalogTheme
}

// Generic App component. Provides toaster, styles, theme, and xkit.js
// Should be exactly ONE of these rendered on the page
class AppWrapper extends React.Component<AppWrapperProps, AppWrapperState> {
  static defaultProps = {
    theme: {}
  }

  constructor (props: AppWrapperProps) {
    super(props)
    this.state = {
      theme: buildTheme(this.props.theme)
    }
  }

  componentDidUpdate (prevProps: AppWrapperProps) {
    if (this.props.theme !== prevProps.theme) {
      this.setState({
        theme: buildTheme(this.props.theme)
      })
    }
  }

  render () {
    const {
      xkit,
      children
    } = this.props
    const { theme } = this.state

    return (
      <Styled>
        <Toaster>
          <ThemeProvider value={theme}>
            <XkitProvider value={xkit}>
              {children}
            </XkitProvider>
          </ThemeProvider>
        </Toaster>
      </Styled>
    )
  }
}

export default AppWrapper
