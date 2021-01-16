import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Text,
  minorScale,
  majorScale
} from '@treygriffith/evergreen-ui'
// Don't worry, this node.js stuff gets inlined by Parcel
import { readFileSync } from "fs";
const logoSvg = readFileSync(__dirname + '/images/xkit-logo-black.svg', 'utf8')
const monoLogoSvg = readFileSync(__dirname + '/images/xkit-logo-mono-black.svg', 'utf8')

interface PoweredByProps {
  removeBranding?: boolean,
  campaign?: string,
  margin?: number,
  align?: 'left' | 'right'
}

const PoweredBy: React.FC<PoweredByProps> = ({ removeBranding = false, margin = majorScale(4), align = 'left', campaign } = {}) => {
  if (removeBranding) {
    return null
  }

  const [hovered, setHovered] = React.useState(false)

  return (
    <Pane
      is="a"
      href={`https://xkit.co?utm_source=app&utm_campaign=${campaign}`}
      style={{textDecoration: "none"}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      display="flex"
      justifyContent="center"
      marginBottom={margin}
      marginTop={margin}
      marginLeft={align === 'right' ? 'auto' : undefined}
    >
      <Text
        color="black"
        opacity={0.5}
        size={400}
        marginTop={majorScale(1)}
        marginRight={majorScale(1)}
      >
        powered by
      </Text>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(monoLogoSvg)}`}
        width={55}
        style={{
          opacity: 0.5,
          display: hovered ? 'none' : 'block'
        }}
      />
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`}
        width={55}
        style={{display: hovered ? 'block' : 'none'}}
      />
    </Pane>
  )
}

export default PoweredBy
