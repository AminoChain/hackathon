import SearchFooter from "../../searchPage/SearchFooter"
import MarketplaceBanner from "../MarketplaceBanner"
import MarketplaceNav from "../MarketplaceNav"
import MarketplaceTrackingBody from "./MarketplaceTrackingBody"


const MarketplaceTrackingPage = () => {

  return(
    <div>
      <MarketplaceBanner/>
      <MarketplaceNav/>
      <MarketplaceTrackingBody/>
      <SearchFooter/>
    </div>
  )
}

export default MarketplaceTrackingPage