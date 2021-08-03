import { CatalogTheme } from './catalog-theme'

export default function cloneTheme(theme: CatalogTheme): CatalogTheme {
  return {
    ...theme,
    card: { ...theme.card },
    colors: {
      background: { ...theme.colors.background },
      border: { ...theme.colors.border },
      text: { ...theme.colors.text },
      icon: { ...theme.colors.icon },
      intent: { ...theme.colors.intent }
    },
    elevations: [...theme.elevations],
    fills: {
      solid: {
        neutral: { ...theme.fills.solid.neutral },
        blue: { ...theme.fills.solid.blue },
        red: { ...theme.fills.solid.red },
        orange: { ...theme.fills.solid.orange },
        yellow: { ...theme.fills.solid.yellow },
        green: { ...theme.fills.solid.green },
        teal: { ...theme.fills.solid.teal },
        purple: { ...theme.fills.solid.purple }
      },
      subtle: {
        neutral: { ...theme.fills.subtle.neutral },
        blue: { ...theme.fills.subtle.blue },
        red: { ...theme.fills.subtle.red },
        orange: { ...theme.fills.subtle.orange },
        yellow: { ...theme.fills.subtle.yellow },
        green: { ...theme.fills.subtle.green },
        teal: { ...theme.fills.subtle.teal },
        purple: { ...theme.fills.subtle.purple }
      },
      options: [...theme.fills.options]
    },
    palette: {
      ...theme.palette,
      neutral: { ...theme.palette.neutral },
      blue: { ...theme.palette.blue },
      red: { ...theme.palette.red },
      orange: { ...theme.palette.orange },
      yellow: { ...theme.palette.yellow },
      green: { ...theme.palette.green },
      teal: { ...theme.palette.teal },
      purple: { ...theme.palette.purple }
    },
    scales: {
      neutral: { ...theme.scales.neutral },
      blue: { ...theme.scales.blue }
    },
    avatarColors: [...theme.avatarColors],
    badgeColors: [...theme.badgeColors],
    typography: {
      headings: { ...theme.typography.headings },
      text: { ...theme.typography.text },
      fontFamilies: { ...theme.typography.fontFamilies },
      paragraph: { ...theme.typography.paragraph }
    }
  }
}
