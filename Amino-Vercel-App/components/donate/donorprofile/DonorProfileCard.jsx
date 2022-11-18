import { ethers } from 'ethers'
import Link from 'next/link'
import { biobankNames } from '../../../constants/index'

const DonorProfileCard = ({ item }) => {
  const biobank = item.bioBank
  const price = ethers.utils.formatUnits(item.price, 6).toString()

  const BioBankNames = biobankNames

  const date = new Date(item.mintTimestamp * 1000)

  return (
    <Link href={`/marketplace/nft?tokenId=${item.tokenId}&matchRating=0`}>
      <div className="w-fit min-w-[256px] max-w-[256px] bg-white flex flex-col px-5 pt-2 pb-4 mb-[2rem] mr-[2rem] drop-shadow-nftCard cursor-pointer rounded-2xl">
        <div className="py-3">
          <div className="flex flex-row justify-between mb-2">
            <div className="font-satoshiRegular text-base text-main h-min self-end">
              Biobank
            </div>
            <div className=" font-satoshiMedium text-xl rounded-[20px] py-1 px-4 text-main bg-ccBackground self-top">
              {item.size} CC
            </div>
          </div>
          <div className=" font-satoshiBold text-xl text-black">
            {BioBankNames[biobank]}
          </div>
        </div>
        <div className="py-3">
          <div className="font-satoshiRegular text-base text-main">
            Donated On
          </div>
          <div className="font-satoshiBold text-black text-xl mt-[0.4rem] truncate">
            {date.toLocaleDateString()}
          </div>
        </div>
        <div className="py-3">
          <div className="font-satoshiRegular text-base text-main">Price</div>
          <>
            {price > 0 ? (
              <div className="font-satoshiBold text-black text-xl mt-[0.4rem] truncate">
                ${parseFloat(price).toLocaleString()}
              </div>
            ) : (
              <div className="flex font-satoshiBold text-xl rounded-[20px] py-1 px-4 mt-[0.4rem] text-main bg-ccBackground justify-center">
                Sold
              </div>
            )}
          </>
        </div>
      </div>
    </Link>
  )
}

export default DonorProfileCard
