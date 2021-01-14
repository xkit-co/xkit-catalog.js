import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
  Pane,
  Text,
  minorScale,
  majorScale
} from '@treygriffith/evergreen-ui'
import monoLogo from './images/xkit-logo-mono-black.svg'
import logo from './images/xkit-logo-black.svg'

const PoweredBy: React.FC = () => {
  const [hovered, setHovered] = React.useState(false)

  return (
    <Pane
      is="a"
      href="https://xkit.co?utm_source=app&utm_campaign=popup_branding"
      style={{textDecoration: "none"}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      display="flex"
      justifyContent="center"
      marginBottom={majorScale(4)}
      marginTop={majorScale(4)}
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
        src={monoLogo}
        width={55}
        style={{
          opacity: 0.5,
          display: hovered ? 'none' : 'block'
        }}
      />
      <img
        src={logo}
        width={55}
        style={{display: hovered ? 'block' : 'none'}}
      />
    </Pane>
  )
}

export default PoweredBy
