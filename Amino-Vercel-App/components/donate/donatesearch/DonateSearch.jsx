import Image from 'next/image'
import { useState } from 'react'
import search from '../../../assets/search.png'

const DonateSearch = ({ setProgress, setBioBanks, location, setLocation }) => {
  const searchBioBanks = async (e) => {
    e.preventDefault()
    try {
      const body = { location }
      const res = await fetch('/api/nearby-biobanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        let data = await res.json()
        setBioBanks(data)
        setProgress(2)
      }
    } catch (error) {
      console.error(error)
    }
    // setBioBanks(localBioBanks)
  }

  return (
    <div className="w-full px-20 py-5">
      <div className="text-2xl text-black font-satoshiMedium pt-5 pb-[0.8rem]">
        Search donation center
      </div>
      <form onSubmit={searchBioBanks}>
        <div className="flex flex-row border border-main bg-white px-5 rounded-full w-max justify-center">
          <div className="self-center pr-[0.6rem] ">
            <Image src={search} alt="search image" />
          </div>
          <input
            className="w-fit font-satoshiRegular text-base focus:outline-0 bg-white text-main border-0 py-2"
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter city name"
          />
          <input
            type="submit"
            value="Locate Me"
            className="font-satoshiRegular text-black text-base ml-[4rem] cursor-pointer"
          />
        </div>
      </form>
    </div>
  )
}

export default DonateSearch
