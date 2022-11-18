import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import newDonation from '../../../assets/newDonation.png'
import DonorProfileCard from './DonorProfileCard'
import { ethers } from 'ethers'

const DonorProfileBody = () => {
  const [userAddress, setUserAddress] = useState(
    '0x0000000000000000000000000000000000000000'
  )

  useEffect(() => {
    ;(async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const signerAddr = await signer.getAddress()
        setUserAddress(signerAddr)
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [])

  const GET_DONOR_NFTS = gql`
    query Nfts($userAddress: Bytes!) {
      existingTokenIds(where: { donor: $userAddress }) {
        tokenId
        mintTimestamp
        price
        sizeInCC
        bioBank
        buyer
      }
    }
  `

  const {
    loading,
    error,
    data: listing,
  } = useQuery(GET_DONOR_NFTS, {
    variables: { userAddress },
  })
  if (loading) {
    return (
      <div>
        <h2 className="font-satoshiRegular text-black w-1/2">Loading...</h2>
      </div>
    )
  }
  if (error) return `Error! ${error}`

  let donorNftArray = []
  const getData = () => {
    listing.existingTokenIds.forEach((nft, index) => {
      donorNftArray.push({
        tokenId: nft.tokenId,
        bioBank: nft.bioBank,
        price: nft.price,
        size: nft.sizeInCC,
        mintTimestamp: nft.mintTimestamp,
      })
    })
  }
  getData()

  const donorNfts = donorNftArray.map((item, index) => (
    <DonorProfileCard key={index} item={item} />
  ))
  const numOfDonations = donorNftArray.length

  return (
    <div className="w-full flex flex-row px-20 py-5">
      {userAddress === '0x0000000000000000000000000000000000000000' ? (
        <div className="w-full justify-center flex px-auto font-satoshiMedium text-black text-4xl mt-[2rem] mb-[8%]">
          Connect Wallet To View Donations
        </div>
      ) : (
        <div className="w-full flex flex-row flex-wrap">
          {numOfDonations >= 1 ? (
            <div className="w-full flex flex-row flex-wrap">
              {donorNfts}
              <Link href="/donate">
                <div className="flex flex-col justify-center bg-marketplaceButton rounded-2xl drop-shadow-marketplaceButtonShadow1 px-10 mb-[2rem] cursor-pointer">
                  <div className="flex justify-center mb-6">
                    <Image src={newDonation} alt="" draggable="false" />
                  </div>
                  <p className="font-satoshiMedium text-main text-2xl">
                    New Donation
                  </p>
                </div>
              </Link>
            </div>
          ) : (
            <div className="w-full flex flex-col mt-[2rem] mb-[4%] items-center">
              <div className="font-satoshiMedium text-black text-4xl p-2">
                You have no donated Stem Cells
              </div>
              <div className="text-black font-satoshiRegular text-xl p-2">
                Visit the Donations Page to start a donation
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DonorProfileBody
