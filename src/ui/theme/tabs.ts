import { css } from 'glamor'
import { CatalogTheme } from './catalog-theme'
import { Themer, ButtonStateProps } from './evergreen'
import { DefaultAppearance } from '@treygriffith/evergreen-ui'
import { CustomButtonsProps } from './buttons'

interface Gradient {
  start: string,
  end: string
}

type Background = string | Gradient

function isGradient (bg: Background): bg is Gradient {
  if (!bg) return false
  if (typeof bg === 'string') return false
  return true
}

function getEndColor (background: Background): string {
  if (isGradient(background)) {
    return background.end
  }

  return background
}

function defaultControlStyles (theme: CatalogTheme): ButtonStateProps {
  return {
    disabled: {
      pointerEvents: 'none'
    },
    base: {
      cursor: 'pointer'
    },
    hover: {
      cursor: 'pointer'
    },
    focus: {
      cursor: 'pointer'
    },
    active: {
      cursor: 'pointer'
    },
    focusAndActive: {
      cursor: 'pointer'
    }
  }
}

export default function customizeTabs (theme: CatalogTheme, props: CustomButtonsProps): CatalogTheme {
  return {
    ...theme,
    getTabClassName (appearance: DefaultAppearance): string {
      const buttonProps = props && props['primary']
      // https://github.com/segmentio/evergreen/blob/master/src/theme/src/default-theme/component-specific/getTabClassName.js#L21
      let color = buttonProps ? getEndColor(buttonProps.background) : theme.scales.blue.B9

      const defaults = defaultControlStyles(this)
      const tabAppearance = Themer.createTabAppearance({
        ...defaults,
        current: {
          color: color,
          cursor: 'pointer'
        }
      })

      // Overriding the appearance:
      // https://github.com/segmentio/evergreen/blob/master/src/themer/src/createTabAppearance.js
      return css({
        ...tabAppearance,
        position: 'relative',
        padding: '6px 2px !important',
        marginLeft: '0px !important',
        marginRight: '20px !important',
        height: 'auto !important',
        '&::before': {
          content: ' ',
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          height: '2px',
          borderRadius: '2px 2px 0px 0px',
          width: '100%',
          transition: 'all 0.25s ease 0s',
          transform: 'scaleY(1)',
          transformOrigin: 'center bottom'
        },
        '&[aria-current="page"]::before, &[aria-selected="true"]::before': {
          backgroundColor: color
        }
      }).toString()
    }
  }
}
