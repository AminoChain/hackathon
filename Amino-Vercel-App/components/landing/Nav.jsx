import Image from 'next/image'
import Link from 'next/link'
import aminoLogo from '../../assets/aminoLogo2.png'
import dot from '../../assets/footerDot.png'

const Nav = () => {
  return (
    <div className="w-full flex flex-row justify-between px-[10%]">
      <Link href="/">
        <div>
          <Image
            src={aminoLogo}
            alt="Image of AminoChain Logo"
            height={40}
            width={71}
            className="cursor-pointer"
            draggable="false"
          />
        </div>
      </Link>
      <div className="flex flex-row justify-between align-middle h-fit min-w-[12rem]">
        <div className="text-base font-satoshiMedium text-black cursor-pointer h-fit">
          Docs
        </div>
        <div className="flex self-center h-fit">
          <Image src={dot} alt="" draggable="false" />
        </div>
        <Link href="/biobank/appointments">
          <div className="text-base font-satoshiMedium text-primary hover:text-primaryHover cursor-pointer h-fit">
            BioBank Access
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Nav
