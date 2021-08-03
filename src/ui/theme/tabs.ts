import { CatalogTheme } from './catalog-theme'
import { Themer } from './evergreen'
import { TabAppearance } from '@treygriffith/evergreen-ui'
import defaultControlStyles from './default-control-styles'
import cssClass from './css-class'

export type CustomTabProps = Partial<{
  textColor: string
}>

// https://github.com/segmentio/evergreen/blob/master/src/theme/src/default-theme/component-specific/getTabClassName.js
function defaultAppearance(theme: CatalogTheme, color: string): any {
  const { disabled } = defaultControlStyles(theme)
  return Themer.createTabAppearance({
    base: {},
    hover: {
      backgroundColor: theme.scales.neutral.N2A
    },
    focus: {
      boxShadow: `0 0 0 2px ${theme.scales.blue.B5A}`
    },
    active: {
      backgroundColor: theme.scales.blue.B3A,
      color: color
    },
    disabled,
    current: {}
  })
}

function minimalAppearance(theme: CatalogTheme, color: string): any {
  const { disabled } = defaultControlStyles(theme)

  const appearance = Themer.createTabAppearance({
    base: {},
    hover: {},
    focus: {},
    active: {
      color: color
    },
    disabled,
    current: {}
  })

  return {
    ...appearance,
    position: 'relative',
    '&::before': {
      content: ' ',
      position: 'absolute',
      bottom: '0px',
      right: '0px',
      height: '2px',
      borderRadius: '2px 2px 0px 0px',
      width: '100%',
      transition: 'all 0.25s ease 0s',
      transform: 'scaleY(0)',
      transformOrigin: 'center bottom',
      backgroundColor: color
    },
    // https://github.com/segmentio/evergreen/blob/master/src/themer/src/createTabAppearance.js
    '&[aria-current="page"]::before, &[aria-selected="true"]::before': {
      transform: 'scaleY(1)'
    }
  }
}

export default function customizeTabs(
  theme: CatalogTheme,
  props?: CustomTabProps
): CatalogTheme {
  const color = props?.textColor || theme.scales.blue.B9
  const defaultTabClassName = cssClass(defaultAppearance(theme, color))
  const minimalTabClassName = cssClass(minimalAppearance(theme, color))

  return {
    ...theme,
    getTabClassName(appearance: TabAppearance): string {
      return appearance === 'minimal'
        ? minimalTabClassName
        : defaultTabClassName
    }
  }
}
