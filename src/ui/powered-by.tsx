import * as React from 'react'
import { Pane, Text, majorScale } from '@treygriffith/evergreen-ui'
import { logo, monoLogo } from './images'

interface PoweredByProps {
  removeBranding?: boolean
  campaign?: string
  margin?: number
  align?: 'left' | 'right'
}

const PoweredBy: React.FC<PoweredByProps> = ({
  removeBranding = false,
  margin = majorScale(4),
  align = 'left',
  campaign
} = {}) => {
  const [hovered, setHovered] = React.useState(false)

  if (removeBranding) {
    return null
  }

  return (
    <Pane
      is='a'
      href={`https://xkit.co?utm_source=app&utm_campaign=${campaign}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      display='flex'
      justifyContent='center'
      height={28}
      marginBottom={margin}
      marginTop={margin}
      marginLeft={align === 'right' ? 'auto' : undefined}
    >
      <Text
        color='black'
        opacity={0.5}
        size={400}
        marginTop={majorScale(1)}
        marginRight={majorScale(1)}
      >
        powered by
      </Text>
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(monoLogo)}`}
        width={55}
        style={{
          opacity: 0.5,
          display: hovered ? 'none' : 'block'
        }}
      />
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(logo)}`}
        width={55}
        style={{ display: hovered ? 'block' : 'none' }}
      />
    </Pane>
  )
}

export default PoweredBy
