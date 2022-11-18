import { ethers } from 'ethers'
import { useState } from 'react'
import MarketplaceCreateAccount from './MarketplaceCreateAccount'
import MarketplaceProfileHistory from './MarketplaceProfileHistory'
import MarketplaceProfileStats from './MarketplaceProfileStats'

const MarketplaceProfileBody = ({ loggedIn, setLoggedIn }) => {
  return (
    <div className="py-2">
      <MarketplaceProfileStats />
      <MarketplaceProfileHistory />
      <MarketplaceCreateAccount />
    </div>
  )
}

export default MarketplaceProfileBody
