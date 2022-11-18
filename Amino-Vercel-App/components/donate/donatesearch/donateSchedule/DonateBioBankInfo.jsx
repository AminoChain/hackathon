import Image from 'next/image'
import googleMaps from '../../../../assets/googleMaps.png'
import bioBankSymbolBig from '../../../../assets/bioBankSymbolBig.png'

const DonateBioBankInfo = ({ bioBank }) => {
  return (
    <div className="w-[30%] flex flex-col items-start pl-20 py-20">
      <div>
        <Image src={bioBankSymbolBig} width={200} height={178} alt="biobank symbol"/>
      </div>
      <div className="flex flex-col pt-4">
        <div className=" font-satoshiMedium text-main text-[16px]">Name</div>
        <div className="font-satoshiBold text-black text-[24px]">
          {bioBank.name}
        </div>
      </div>
      <div className="flex flex-col py-4">
        <div className="font-satoshiMedium text-main text-[16px]">
          Opening hours
        </div>
        <div className="font-satoshiRegular pt-1 text-black text-[20px]">
          Mon to Fri 10 am to 6pm
        </div>
      </div>

      <div className="flex flex-col items-start">
        <div className="font-satoshiMedium text-main text-[16px] pb-2">
          Address
        </div>
        <div className="flex items-center">
          <div className="mr-[2px]">
            <Image src={googleMaps} width={30} height={46} alt="google logo" />
          </div>
          <div className="underline-offset-1 underline font-satoshiRegular text-xl ml-2 text-black">
            {bioBank.location}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DonateBioBankInfo
