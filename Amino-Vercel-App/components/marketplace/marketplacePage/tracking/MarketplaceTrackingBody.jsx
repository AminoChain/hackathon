import locate from '../../../../assets/locate.png'
import Image from 'next/image'
import { useState } from 'react'

const MarketplaceTrackingBody = () => {
  const [orderId, setOrderId] = useState('')
  const findOrder = (e) => {
    e.preventDefault()
    // add some logic here for accessing the tracking api
    console.log(e.target[0].value)
  }
  return (
    <div className="flex flex-col px-20">
      <div className=" font-satoshiBold text-[40px] text-black">
        Track shipment
      </div>
      <div className=" font-satoshiMedium text-black text-xl py-4">
        Enter Order ID of your purchase
      </div>
      <form onSubmit={findOrder} className='flex w-1/4 py-5'>
        <div className="flex flex-row w-full border border-main bg-white px-5 rounded-full justify-start">
          <div className="flex items-center pr-[0.6rem] ">
            <Image src={locate} alt="target image" />
          </div>
          <input
            className="w-fit font-satoshiRegular text-base focus:outline-0 bg-white text-main border-0 py-2"
            type="text"
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
          />
        </div>
      </form>
    </div>
  )
}

export default MarketplaceTrackingBody
