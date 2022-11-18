import Image from 'next/image'
import Link from 'next/link'
import dot from '../../../assets/footerDot.png'
import share from '../../../assets/share.png'

const BioBankHistory = () => {
  return (
    <div className="w-full flex items-center border-b-[1px] border-main py-8 px-8">
      <div className=" font-satoshiMedium text-black basis-3/12 flex items-center">
        Nov 2nd
        <div className="flex items-center px-2">
          <Image src={dot} alt="dot image" draggable="false" />
        </div>
        10:15 am
      </div>
      <div className=" font-satoshiMedium text-black basis-5/12">
        0x279A27Ee501E1a515429573691683971FE2aBbfd
      </div>
      <div className="font-satoshiMedium text-black basis-2/12">30cc</div>
      <Link href="/marketplace">
        <div className="flex justify-center basis-2/12">
          <div className="w-fit flex justify-center py-3 px-7 border border-main rounded-full cursor-pointer">
            <div className='flex h-[22px] items-center'>
              <div className="font-satoshiMedium text-black pr-2">
                Marketplace
              </div>
              <div className='flex items-center'>
                <Image src={share} alt="share icon"/>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BioBankHistory
