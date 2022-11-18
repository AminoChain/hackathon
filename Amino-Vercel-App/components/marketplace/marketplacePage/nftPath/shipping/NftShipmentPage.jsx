import SearchFooter from "../../../searchPage/SearchFooter"
import MarketplaceBanner from "../../MarketplaceBanner"
import NftShipmentBody from "./NftShipmentBody"
import ShippingForm from "./ShippingForm"


const NftShippmentPage = ({NftData}) => {
  return (
    <div className="w-screen">
      <MarketplaceBanner/>
      <NftShipmentBody NftData={NftData}/>
      <ShippingForm/>
      <SearchFooter/>
    </div>

  )
}

export default NftShippmentPage
