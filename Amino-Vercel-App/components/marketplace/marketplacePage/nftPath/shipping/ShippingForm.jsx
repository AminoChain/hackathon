import { useState } from 'react'

const ShippingForm = () => {
  const [shipmentConfirmed, setShipmentConfirmed] = useState()
  const writeShipingInfo = async (e) => {
    e.preventDefault()
    const body = e.currentTarget
    const name = body[0].value
    const street = body[1].value
    const apartmentNum = body[2].value
    const state = body[3].value
    const zipcode = body[4].value

    const destination = {
      name: name,
      street: street,
      apartmentNum: apartmentNum,
      state: state,
      zipcode: zipcode,
      arrived: false
    }

    try {
      const res = await fetch('/api/shipping-info-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(destination),
      })
      if (res.ok) {
        setShipmentConfirmed(true)
      }
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="flex flex-col px-20 py-3">
      <div className="flex flex-col py-2">
        <div className="font-satoshiBold text-xl text-black py-2">
          Shipping Details
        </div>
        <div className=" font-satoshiMedium text-black pb-2">
          Your shipment could take upto 10 days to arrive
        </div>
      </div>
      {!shipmentConfirmed ? (
        <form onSubmit={writeShipingInfo} className="flex">
          <div className="basis-2/12">
            <div className=" font-satoshiMedium text-main">Full name</div>
            <input
              type="text"
              placeholder="Cell Cold Storage"
              className="border-b-[1px] border-black p-1 pl-0 text-black font-satoshiMedium"
            />
          </div>
          <div className="basis-2/12">
            <div className=" font-satoshiMedium text-main">St name</div>
            <input
              type="text"
              placeholder="street"
              className="border-b-[1px] border-black p-1 pl-0 text-black font-satoshiMedium"
            />
          </div>
          <div className="basis-2/12">
            <div className=" font-satoshiMedium text-main">Apt number</div>
            <input
              type="text"
              placeholder="Cell Cold Storage"
              className="border-b-[1px] border-black p-1 pl-0 text-black font-satoshiMedium"
            />
          </div>
          <div className="basis-2/12">
            <div className=" font-satoshiMedium text-main">State</div>
            <input
              type="text"
              placeholder="Cell Cold Storage"
              className="border-b-[1px] border-black p-1 pl-0 text-black font-satoshiMedium"
            />
          </div>
          <div className="basis-2/12">
            <div className=" font-satoshiMedium text-main">Zip code</div>
            <input
              type="text"
              placeholder="Cell Cold Storage"
              className="border-b-[1px] border-black p-1 pl-0 text-black font-satoshiMedium"
            />
          </div>
          <div className="flex justify-center items-center">
            <input
              className="flex justify-items-center text-xl cursor-pointer bg-marketplaceButton font-satoshiBold px-8 py-4 rounded-full text-black drop-shadow-searchButtonShadow "
              name="submit"
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      ) : (
        <div className="font-satoshiBold text-black text-4xl">Successfully Submitted!</div>
      )}
    </div>
  )
}

export default ShippingForm
