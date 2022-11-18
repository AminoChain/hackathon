import Image from 'next/image'
import Link from 'next/link'
import dot from '../../../assets/footerDot.png'

const BioBankAppointment = () => {
  return (
    <div className="w-full flex items-center border-b-[1px] border-main py-8 px-8">
      <div className=" font-satoshiMedium text-black basis-3/12 flex items-center">
        Nov 2nd
        <div className="flex items-center px-2" >
          <Image src={dot} alt="dot image" draggable="false" />
        </div>
        10:15 am
      </div>
      <div className=" font-satoshiMedium text-black basis-7/12">
        0x279A27Ee501E1a515429573691683971FE2aBbfd
      </div>
      <Link href="/biobank/appointments/register" as="/biobank/appointments/register" >
        <div className=" font-satoshiMedium text-black basis-2/12 flex justify-center">
          <div className="bg-primary flex py-3 px-7 font-satoshiMedium text-black rounded-full cursor-pointer">
            Start verification
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BioBankAppointment
