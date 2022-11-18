import Image from 'next/image'
import checkGreen from '../../../../../assets/success.png'
import NftShipmentCard from './NftShipmentCard'


const NftBoughtSuccess = ({NftData}) => {

  return (
    <div className="w-full flex flex-col items-center px-36 py-10 confettiBG">
      <div className="flex items-center font-satoshiBold text-black text-2xl pb-10">
        <div>Verification successful</div>
        <div className="px-2 flex items-center">
          <Image src={checkGreen} alt="checkgreen icon" />
        </div>
      </div>
      <NftShipmentCard NftData={NftData}/>
    </div>
  )
}

export default NftBoughtSuccess
