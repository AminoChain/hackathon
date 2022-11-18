import MarketplaceNftCard from './MarketplaceNftCard'
import { ethers } from 'ethers'
import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import filter from '../../../assets/filterIcon.png'
import closeFilter from '../../../assets/filterX.png'
import MarketplaceBanner from './MarketplaceBanner'
import MarketplaceNav from './MarketplaceNav'
import SearchFooter from '../searchPage/SearchFooter'
import MarketplaceFilterMenu from './MarketplaceFilterMenu'

const MarketplacePage = ({ search }) => {
  const [filterMenuOpen, setFilterMenu] = useState(false)
  const [matchFilter, setMatchFilter] = useState(null)
  const [highestPrice, setHighestPrice] = useState(null)


  const GET_MINTED_NFTS = gql`
    {
      existingTokenIds(
        where: { buyer: "0x0000000000000000000000000000000000000000" }
      ) {
        tokenId
        price
        donor
        bioBank
        sizeInCC
        hlaHashes {
          hlaHashed_A
          hlaHashed_B
          hlaHashed_C
          hlaHashed_DPB
          hlaHashed_DRB
        }
      }
    }
  `
  const { loading, error, data: listing } = useQuery(GET_MINTED_NFTS)

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }

  if (error) return `Error! ${error}`

  let matchRating = 0
  let bestMatchNftArray = []
  const matchingAlgo = () => {
    listing.existingTokenIds.forEach((nft, index) => {
      const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)

      //hashes input and compares to hashed hla
      if (
        equals(
          nft.hlaHashes.hlaHashed_A,
          ethers.utils.id(search.HLAA.toString())
        )
      ) {
        matchRating++
      }
      if (
        equals(
          nft.hlaHashes.hlaHashed_B,
          ethers.utils.id(search.HLAB.toString())
        )
      ) {
        matchRating++
      }
      if (
        equals(
          nft.hlaHashes.hlaHashed_C,
          ethers.utils.id(search.HLAC.toString())
        )
      ) {
        matchRating++
      }
      if (
        equals(
          nft.hlaHashes.hlaHashed_DPB,
          ethers.utils.id(search.HLADPB.toString())
        )
      ) {
        matchRating++
      }
      if (
        equals(
          nft.hlaHashes.hlaHashed_DRB,
          ethers.utils.id(search.HLADRB.toString())
        )
      ) {
        matchRating++
      }
      bestMatchNftArray.push({
        tokenId: nft.tokenId,
        matchRating: matchRating,
        bioBank: nft.bioBank,
        price: nft.price,
        size: nft.sizeInCC,
      })
      matchRating = 0
    })
  }
  const findHighestPrice = () => {
    if (highestPrice === null) {
      bestMatchNftArray.sort((a, b) => {
        return b.price - a.price
      })
      setHighestPrice(bestMatchNftArray[0].price)
    }
  }
  const organizeBestMatches = () => {
    findHighestPrice()
    bestMatchNftArray.sort((a, b) => {
      return b.matchRating - a.matchRating
    })
  }
  matchingAlgo()
  organizeBestMatches()

  const nftMatches = bestMatchNftArray.map((item, index) => <MarketplaceNftCard key={index} item={item} /> )

  return (
    <div className="w-[100vw] flex flex-col min-h-[100vh]">
      <MarketplaceBanner />
      <MarketplaceNav />
      <div className="w-full px-[5%]">
        <div
          className="flex justify-center ml-auto items-center cursor-pointer bg-white text-black text-base border border-main font-satoshiMedium h-10 w-10 rounded-full"
          onClick={() => {
            setFilterMenu(!filterMenuOpen)
          }}
        >
          {filterMenuOpen ? (
            <Image src={closeFilter} alt="x" draggable="false" />
          ) : (
            <Image src={filter} alt="f" draggable="false" />
          )}
        </div>
        {filterMenuOpen ? (
          <MarketplaceFilterMenu matchFilter={matchFilter} setMatchFilter={setMatchFilter} />
        ) : (
          <></>
        )}
      </div>
      <div className="w-full flex flex-wrap py-8 px-[5%]">{nftMatches}</div>
      <SearchFooter />
    </div>
  )
}

export default MarketplacePage
