declare module 'remark-react' {
  import * as React from 'react'
  import { Transformer, Processor } from 'unified'

  export type elements =
    | 'code'
    | 'p'
    | 'ul'
    | 'ol'
    | 'li'
    | 'a'
    | 'strong'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'

  export type components = Record<elements, React.ComponentType>

  interface options {
    remarkReactComponents: components
  }

  function remark2react<P>(this: Processor<P>, settings: options): Transformer

  export default remark2react
}

declare module '*.css' {
  const styles: string
  export default classes
}
