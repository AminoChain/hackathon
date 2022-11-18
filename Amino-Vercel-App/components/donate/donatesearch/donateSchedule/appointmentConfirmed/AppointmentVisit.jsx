import Image from 'next/image'
import checkGreen from '../../../../../assets/checkGreen.png'
import checkGrey from '../../../../../assets/checkGrey.png'
import dottedLine from '../../../../../assets/dottedLine.png'
import QRcode from '../../../../../assets/QRcode.png'
import metamaskLogo from '../../../../../assets/metamaskLogo.png'

const AppointmentVisit = ({ bioBank }) => {
  return (
    <div className="w-fit">
      <div className="border-b-2 py-3">
        <div className="font-satoshiBold text-black text-[24px] py-2">
          Visit the donation center and verify donation
        </div>
        <div className=" font-satoshiMedium text-black">
          Once approved, your donation will be tokenized and you will be ready
          to receive royalties
        </div>
      </div>
      <div className="flex flex-col pt-4">
        <div className="flex">
          <div className="flex items-center pr-2">
            <Image src={checkGreen} width={20} draggable="false" alt='checkgreen icon' />
          </div>
          <div className=" font-satoshiMedium text-black">Book Appointment</div>
        </div>
        <div className="p-2">
          <Image src={dottedLine} draggable="false" alt='dotted line image' />
        </div>
        <div className="flex items-center">
          <div className="flex items-center pr-2">
            <Image src={checkGrey} width={20} draggable="false" alt='checkgrey icon' />
          </div>
          <div className=" font-satoshiMedium text-black">
            Scan QR code at the donation center after donating Stem Cells
          </div>
        </div>
      </div>
      <div className="flex justify-center p-10">
        <div className="flex justify-center qrCodeShadow p-8 rounded-[20px]">
          <div>
            <Image src={QRcode} draggable="false" alt='qrcode icon' />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center ">
          <Image src={metamaskLogo} draggable="false" alt='metamask logo' />
        </div>
        <div className="flex flex-col px-2">
          <div className=" font-satoshiRegular text-black">
            You will need the MetaMask mobile app to scan the QR Code generated
            at {bioBank.name}
          </div>
          <div>
            <a
              href="https://metamask.io/"
              className="  text-purpleHLADQA underline underline-offset-2"
            >
              Download here
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentVisit
