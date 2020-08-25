import * as React from 'react'
import {
  defaultTheme,
  Theme,
  // @ts-ignore
  withTheme as untypedWithTheme,
  // @ts-ignore
  ThemeProvider as UntypedProvider
} from '@treygriffith/evergreen-ui'

type CustomPalette = typeof defaultTheme.palette & {
  base: string
}

const palette: CustomPalette = {
  ...defaultTheme.palette,
  base: 'white'
}

interface CustomTheme extends Omit<Theme, 'palette'> {
  palette: CustomPalette
}

const theme: CustomTheme = {
  ...defaultTheme,
  palette
}

export type ThemeConsumer<Props = {}> = Props & {
  theme: CustomTheme
}

// ThemeProvider is not in the index.d.ts for evergreen
const ThemeProvider = UntypedProvider as React.Provider<typeof defaultTheme>

type ThemeHOC = <Props extends {}>(WrappedComponent: React.ComponentType<Props>) => React.ComponentType<Omit<Props, keyof ThemeConsumer>>

// withTheme is not in the index.d.ts for evergreen
const withTheme: ThemeHOC = untypedWithTheme as ThemeHOC

export { theme, ThemeProvider, withTheme }
 
