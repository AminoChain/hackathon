import Image from 'next/image'
import nftCellsArt from '../../../../assets/nftCellsArt.png'
import aminoLogo2 from '../../../../assets/aminoLogo2.png'

const NftArtCard = ({ nftData, matchRating }) => {
  const biobank = nftData.bioBank
  const donor =
    nftData.donor.slice(0, 4) +
    '...' +
    nftData.donor.slice(nftData.donor.length - 4, nftData.donor.length)

  const BioBankNames = {
    '0x53c847035e9c2ea3aead920d395bccd7768ee63f': 'Coriell',
    '0x35a5b80732efe78d171327c39de408227c299aac': 'Greenville',
    '': 'National',
  }

  return (
    <div className="w-1/4">
      <div className="w-full p-10 nftCellsShadowPink rounded-3xl">
        <div className="flex h-min justify-center">
          <Image src={nftCellsArt} alt="nftcells image" draggable="false" />
        </div>
        <div className="w-2/3 border-b-[1px] mt-[4rem] border-slate-200 "></div>
        <div>
          <div className="pb-[0.2rem] font-satoshiMedium text-base mt-[1rem] text-main">
            Donor
          </div>
          <div className="font-satoshiBold text-lg text-black pb-[1rem]">
            {donor}
          </div>
        </div>
        <div className="w-2/3 h-[1px] border-b-[1px] border-slate-200"></div>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <div className="pb-[0.2rem] font-satoshiMedium mt-[1rem] text-base text-main">
              BioBank
            </div>
            <div className="font-satoshiBold text-lg text-black">
              {BioBankNames[biobank]}
            </div>
          </div>
          <div className="flex h-min justify-center">
            <Image
              src={aminoLogo2}
              alt="aminochain logo image"
              height={42}
              width={75}
              draggable="false"
            />
          </div>
        </div>
      </div>
      <div className="flex w-full m-0 pt-6 justify-between items-center">
        <div className="w-1/3 font-satoshiRegular text-base text-main">
          Match Rate
        </div>
        <div className="flex w-2/3 items-center">
          <div className="px-2 font-satoshiRegular text-base text-black">
            {matchRating}%
          </div>
          <div className=" w-full h-2 bg-slate-200 rounded-full">
            <div
              style={{ width: `${matchRating}%` }}
              className="h-2 bg-primary rounded-full"
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NftArtCard
