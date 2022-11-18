import { ethers } from 'ethers'
import Image from 'next/image'
import usdcLogo from '../../../../assets/usdcLogo.png'
import hidden from '../../../../assets/hlaHidden.png'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  contractAddresses,
  abis,
  biobankNames,
} from '../../../../constants/index'
import { platformBackend } from '../../../../context/state'

const NftDetailsAndBuy = ({ nftData }) => {
  const router = useRouter()
  const [hlaHidden, setHlaHidden] = useState(true)
  const [genomeHidden, setGenomeHidden] = useState(true)
  const [hlaSource, setHlaSource] = useState()
  const [genome, setGenome] = useState()
  const [marketplace, setMarketplace] = useState()
  const [userAddress, setUserAddress] = useState()

  useEffect(() => {
    ;(async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        if (provider) {
          const signer = await provider.getSigner()
          const signerAddr = await signer.getAddress()
          setUserAddress(signerAddr)

          const marketplaceContract = new ethers.Contract(
            contractAddresses.marketplace,
            abis.marketplace,
            signer
          )
          setMarketplace(marketplaceContract)
        }
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [])

  const biobank = nftData.bioBank
  const donor =
    nftData.donor.slice(0, 4) +
    '...' +
    nftData.donor.slice(nftData.donor.length - 4, nftData.donor.length)
  const nftContract =
    contractAddresses.donation.slice(0, 4) +
    '...' +
    contractAddresses.donation.slice(
      contractAddresses.donation.length - 4,
      contractAddresses.donation.length
    )
  const price = ethers.utils.formatUnits(nftData.price, 6).toString()

  const BioBankNames = biobankNames
  const date = new Date(nftData.mintTimestamp * 1000)

  const unhideHla = async () => {
    try {
      // const approved = marketplace && await marketplace.isApprovedToBuy(userAddress)
      const approved = true

      if (approved === true) {
        const response = await fetch(
          platformBackend + `decode-hla/${nftData.tokenId}`
        )
        if (response.ok) {
          setHlaSource(await response.json())
          setHlaHidden(!hlaHidden)
        }
      } else {
        console.warn('Address not approved as doctor or reseacher')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const unhideGenome = async () => {
    try {
      // const approved = marketplace && await marketplace.isApprovedToBuy(userAddress)
      const approved = true

      if (approved === true) {
        const response = await fetch(
          platformBackend + `decode-genome/${nftData.tokenId}`
        )
        if (response.ok) {
          setGenome(await response.text())
          setGenomeHidden(false)
        }
      } else {
        console.warn('Address not approved as doctor or reseacher')
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function handlePurchase() {
    let usdcContract, marketplace
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = await provider.getSigner()
      const signerAddr = await signer.getAddress()

      usdcContract = new ethers.Contract(
        contractAddresses.usdc,
        abis.usdc,
        signer
      )
      marketplace = new ethers.Contract(
        contractAddresses.marketplace,
        abis.marketplace,
        signer
      )

      const price = await marketplace.getListingData(nftData.tokenId)
      const userBal = await usdcContract.balanceOf(signerAddr)

      if (parseInt(userBal.toString()) >= parseInt(price.price.toString())) {
        const allowance = await usdcContract.allowance(
          signerAddr,
          contractAddresses.marketplace
        )
        if (
          parseInt(allowance.toString()) >= parseInt(price.price.toString())
        ) {
          try {
            await marketplace.buyItem(nftData.tokenId)
          } catch (e) {
            console.warn(e)
          }
        } else {
          //approve maximum amount {trade off between ux and user security}
          try {
            await usdcContract.approve(
              contractAddresses.marketplace,
              '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
            )
            router.push(`/marketplace/nft/shipping?tokenId=${nftData.tokenId}`) // routes to the shipping page
          } catch (e) {
            console.warn(e)
          }
        }
      } else {
        console.warn('User usdc balance too low.')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <div className="w-2/3 flex flex-col px-8">
      <div className="border-l-2 p-4 mb-2 rounded-xl w-full ">
        <div className=" flex flex-col">
          <div className="pb-4 font-satoshiBold text-base text-main">
            Sequence Details
          </div>
          <div className="border-b-[1px] "></div>
        </div>
        <div className="flex flex-col pt-4">
          <p className="text-main font-satoshiRegular text-base pb-2">
            HLA Haplotypes
          </p>
          {hlaHidden ? (
            <div
              onClick={unhideHla}
              className="flex flex-row justify-between py-4 px-6 w-3/4 font-satoshiMedium text-base rounded-md bg-hiddenHla text-black mb-4"
            >
              Only Available to doctors and researchers.
              <div className="flex h-min self-center cursor-pointer">
                <Image src={hidden} alt="" draggable="false" />
              </div>
            </div>
          ) : (
            <div className="flex flex-row space-x-[2rem] font-satoshiBold text-black text-base">
              <div className="flex flex-col">
                <p className="pb-2">HLA A: {hlaSource.A.join(', ')}</p>
                <p>HLA DRB: {hlaSource.DRB.join(', ')}</p>
              </div>
              <div className="flex flex-col">
                <p className="pb-2">HLA B: {hlaSource.B.join(', ')}</p>
                <p>HLA DPB: {hlaSource.DPB.join(', ')}</p>
              </div>
              <div className="flex flex-col">
                <p className="pb-2">HLA C: {hlaSource.C.join(', ')}</p>
              </div>
            </div>
          )}

          <p className="text-main font-satoshiRegular text-base pb-2">
            Genome and Donor Condition Details
          </p>
          {genomeHidden ? (
            <div
              onClick={unhideGenome}
              className="flex flex-row justify-between py-4 px-6 w-3/4 font-satoshiMedium text-base rounded-md bg-hiddenHla text-black"
            >
              Only Available to doctors and researchers.
              <div className="flex h-min self-center cursor-pointer">
                <Image src={hidden} alt="" draggable="false" />
              </div>
            </div>
          ) : (
            <div className="flex flex-row space-x-[2rem] font-satoshiBold text-black text-base">
              {genome}
            </div>
          )}
        </div>
        <div className="flex justify-between w-fit ">
          <div className="px-4 font-satoshiRegular">{nftData.halotypes_A}</div>
          <div className="px-4 font-satoshiRegular">{nftData.halotypes_B}</div>
          <div className="px-4 font-satoshiRegular">{nftData.halotypes_C}</div>
        </div>
        <div className="flex justify-between w-fit">
          <div className="px-4 font-satoshiRegular">
            {nftData.halotypes_DPB}
          </div>
          <div className="px-4 font-satoshiRegular">
            {nftData.halotypes_DRB}
          </div>
        </div>
      </div>
      <div className="border-l-2 px-4 py-4 rounded-xl w-full my-2">
        <div className="flex flex-col">
          <div className="pb-4 font-satoshiBold text-base text-main">
            Donation Details
          </div>
          <div className="border-b-[1px] "></div>
        </div>
        <div className="flex w-full">
          <div className="flex flex-col w-full">
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                Donor
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {donor}
              </div>
            </div>
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                TokenId
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {nftData.tokenId}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                Donated On
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {date.toLocaleDateString()}
              </div>
            </div>
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                Contract Address
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {nftContract}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                BioBank
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {BioBankNames[biobank]}
              </div>
            </div>
            <div className=" flex flex-col">
              <div className="pt-4 pb-2 font-satoshiRegular text-base text-main">
                Amount
              </div>
              <div className="font-satoshiMedium text-xl text-black">
                {nftData.sizeInCC} CC
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-2/3 px-4 pt-2 items-center justify-around">
        <div className="flex flex-col">
          <div className="pt-2 font-satoshiRegular text-base text-main">
            Price
          </div>
          <div className="flex items-center">
            <div className="p-2 pl-0 flex items-center">
              <Image src={usdcLogo} alt="usdcLogo" draggable="false" />
            </div>
            <div className="p-2 font-satoshiBold text-black text-xl">
              ${parseFloat(price).toLocaleString()} USDC
            </div>
          </div>
        </div>
        <button
          className=" py-5 px-[5rem] rounded-full text-xl font-satoshiBold text-black bg-gradient-to-r drop-shadow-marketplaceButtonShadow1 from-gradientDonateStart to-gradientDonateEnd"
          onClick={handlePurchase}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default NftDetailsAndBuy
