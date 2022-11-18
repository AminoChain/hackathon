import React from 'react'
import { useState } from 'react'
import Marketplace from '../../components/marketplace/Marketplace'

const Market = () => {
  const [matches, setMatches] = useState({})
  const [search, setSearch] = useState({})

  // let title = props.title
  // if (!props.published) {
  //   title = `${title} (Draft)`
  // }
  return (
    <Marketplace
      search={search}
      setSearch={setSearch}
      matches={matches}
      setMatches={setMatches}
    />
  )
}

export default Market
