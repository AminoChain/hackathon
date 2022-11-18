import MarketplaceBanner from '../MarketplaceBanner'
import NftArtCard from './NftArtCard'
import NftDetails from './NftDetails'
import SearchFooter from '../../searchPage/SearchFooter'

const NftListingPage = ({ nftData, matchRating }) => {
  return (
    <div className="w-[100vw]">
      <MarketplaceBanner />
      <div className="w-full px-52 pt-[2rem]">
        <div className="w-full flex">
          <NftArtCard nftData={nftData} matchRating={matchRating}/>
          <NftDetails nftData={nftData} />
        </div>
      </div>
      <SearchFooter />
    </div>
  )
}

export default NftListingPage
