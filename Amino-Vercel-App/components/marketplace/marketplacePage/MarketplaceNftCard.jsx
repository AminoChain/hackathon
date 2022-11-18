import Link from 'next/link'
import { ethers } from 'ethers'
import { biobankNames } from '../../../constants'

const MarketplaceNftCard = ({ item }) => {
  const percentage = (item.matchRating / 5) * 100
  const biobank = item.bioBank
  const price = ethers.utils.formatUnits(item.price, 6).toString()

  const BioBankNames = biobankNames

  return (
    <Link
      href={`/marketplace/nft?tokenId=${item.tokenId}&matchRating=${percentage}`}
    >
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
          <div className="pb-2 font-satoshiRegular text-base text-main">
            Match Rate
          </div>
          <div className=" font-satoshiBold text-xl text-black">
            {percentage}%
          </div>
          <div className="h-2 w-full bg-slate-200 rounded">
            <div
              style={{ width: `${percentage}%` }}
              className={`h-2 bg-primary rounded`}
            ></div>
          </div>
        </div>
        <div className="py-3">
          <div className="font-satoshiRegular text-base text-main">Price</div>
          <div className="font-satoshiBold text-black text-xl mt-[0.4rem] truncate">
            ${parseFloat(price).toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default MarketplaceNftCard
