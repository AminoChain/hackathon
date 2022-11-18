import { useState } from "react"
import SearchFooter from "../../searchPage/SearchFooter"
import MarketplaceBanner from "../MarketplaceBanner"
import MarketplaceNav from "../MarketplaceNav"
import MarketplaceProfileBody from "./MarketplaceProfileBody"



const MarketplaceProfilePage = () => {
  const [loggedIn, setLoggedIn] = useState(false)

return (
  <div>
    <MarketplaceBanner/>
    <MarketplaceNav/>
    <MarketplaceProfileBody loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
    <SearchFooter/>
  </div>
)
  
}

export default MarketplaceProfilePage