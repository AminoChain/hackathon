import Image from 'next/image'
import Link from 'next/link'
import { ethers } from 'ethers'
import dot from '../../../../assets/footerDot.png'
import linkIcon from '../../../../assets/share.png'
import usdcLogo from '../../../../assets/usdcLogo.png'

const MarketplaceProfileTx = ({ item }) => {
  const buyerShort =
    item.buyer.slice(0, 4) +
    '...' +
    item.buyer.slice(item.buyer.length - 4, item.buyer.length)
  const txHashShort =
    item.transcationHash.slice(0, 4) +
    '...' +
    item.transcationHash.slice(
      item.transcationHash.length - 4,
      item.transcationHash.length
    )
  const incentive = ethers.utils.formatUnits(item.incentive, 6).toString()

  const date = new Date(item.date * 1000)

  return (
    <div className="w-full flex items-center border-b-[1px] border-main py-8 pl-8 ">
      <div className="font-satoshiMedium text-black flex items-center basis-[30%]">
        {date.toLocaleDateString()}
        <div className="flex items-center px-2">
          <Image src={dot} alt="dot image" draggable="false" />
        </div>
        {date.toLocaleTimeString()}
      </div>
      <div className=" font-satoshiMedium text-black text-lg basis-[25%]">
        {buyerShort}
      </div>
      <div className="flex flex-row font-satoshiMedium text-black text-lg items-center basis-[30%]">
        <div className="flex mr-2 self-center">
          <Image src={usdcLogo} alt="" draggable="false" />
        </div>
        <p>
          {parseFloat(incentive)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')}
        </p>
      </div>
      <Link href={`https://mumbai.polygonscan.com/tx/` + item.transcationHash}>
        <div className="flex flex-row font-satoshiMedium text-black text-lg justify-center cursor-pointer">
          {txHashShort}
          <div className="ml-2">
            <Image src={linkIcon} alt="" draggable="false" />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default MarketplaceProfileTx
