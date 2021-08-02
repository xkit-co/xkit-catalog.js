import * as React from 'react'
import { Portal as EvergreenPortal } from '@treygriffith/evergreen-ui'
import RehomeEvergreen from './rehome-evergreen'

const Portal: React.FC = ({ children }) => {
  // EvergreenPortal re-uses portals, so if we render it here,
  // we can move the container that all future portals will use
  return (
    <RehomeEvergreen components='data-xkit-portal-container'>
      <EvergreenPortal> </EvergreenPortal>
      {children}
    </RehomeEvergreen>
  )
}

export default Portal
