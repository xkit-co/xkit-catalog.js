import { CatalogTheme } from '.'
import getLinearGradient from './get-linear-gradient'

export default function defaultControlStyles(theme: CatalogTheme): any {
  return {
    disabled: {
      opacity: 0.8,
      backgroundImage: 'none',
      backgroundColor: theme.scales.neutral.N2A,
      boxShadow: 'none',
      color: theme.scales.neutral.N7A,
      pointerEvents: 'none'
    },
    base: {
      backgroundColor: 'white',
      backgroundImage: getLinearGradient('#FFFFFF', '#F4F5F7'),
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 -1px 1px 0 ${theme.scales.neutral.N2A}`
    },
    hover: {
      backgroundImage: getLinearGradient('#FAFBFB', '#EAECEE')
    },
    focus: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${theme.scales.neutral.N5A}, inset 0 -1px 1px 0 ${theme.scales.neutral.N4A}`
    },
    active: {
      backgroundImage: 'none',
      backgroundColor: theme.scales.blue.B3A,
      boxShadow: `inset 0 0 0 1px ${theme.scales.neutral.N4A}, inset 0 1px 1px 0 ${theme.scales.neutral.N2A}`
    },
    focusAndActive: {
      boxShadow: `0 0 0 3px ${theme.scales.blue.B4A}, inset 0 0 0 1px ${theme.scales.neutral.N5A}, inset 0 1px 1px 0 ${theme.scales.neutral.N2A}`
    }
  }
}
