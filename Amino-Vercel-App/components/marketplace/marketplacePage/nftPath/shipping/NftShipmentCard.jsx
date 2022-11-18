import Image from 'next/image'
import nftCellsArt from '../../../../../assets/nftCellsArt.png'
import aminoLogo2 from '../../../../../assets/aminoLogo2.png'

const NftShipmentCard = ({NftData}) => {
  let item = {
    bioBank: '0x53c847035e9c2ea3aead920d395bccd7768ee63f',
    price: 4000,
    tokenId: 3,
    size: '20cc',
    donor: '0x53c847035e9c2ea3aead920d395bccd7768ee63f',
  }
  const biobank = item.bioBank
  const donor =
    item.donor.slice(0, 4) +
    '...' +
    item.donor.slice(item.donor.length - 4, item.donor.length)

  const BioBankNames = {
    "0x53c847035e9c2ea3aead920d395bccd7768ee63f": "Coriell",
    "0x35a5b80732efe78d171327c39de408227c299aac": "Greenville",
    "": "National"
  }

  return (
    <div className="w-1/5 p-10 nftCellsShadowGreen bg-white rounded-3xl">
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
  )
}

export default NftShipmentCard
