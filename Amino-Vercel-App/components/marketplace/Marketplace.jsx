import SearchPage from './searchPage/SearchPage'
import MarketplacePage from './marketplacePage/MarketplacePage'

const Marketplace = ({ search, setSearch, matches, setMatches }) => {
  const isEmpty = Object.keys(search).length === 0

  return (
    <div className="w-[100vw]">
      {isEmpty ? (
        <SearchPage setSearch={setSearch} />
      ) : (
        <MarketplacePage
          search={search}
          matches={matches}
          setMatches={setMatches}
        />
      )}
    </div>
  )
}

export default Marketplace
