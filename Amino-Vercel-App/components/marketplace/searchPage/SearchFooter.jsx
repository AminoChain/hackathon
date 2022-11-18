import Image from 'next/image'
import dot from '../../../assets/footerDot.png'
import discord from '../../../assets/discordLogo.png'
import twitter from '../../../assets/twitterLogo.png'
import github from '../../../assets/githubLogo.png'

const SearchFooter = () => {
  return (
    <div className="w-[100vw] bottom-0 flex px-[12%] mt-[6rem] mb-[2rem]">
      <div className="flex flex-row w-full justify-between content-center border-solid border-b-[1px] py-[1rem] px-[5%] rounded-[200px] border-main min-w-[42%]">
        <div className="flex flex-row justify-between content-center self-center h-min min-w-[160px] ">
          <a href="https://discord.com" className="flex h-min align-middle">
            <Image
              src={discord}
              alt="discord"
              className=" flex self-center"
              draggable="false"
            />
          </a>
          <a
            href="https://twitter.com"
            className="flex h-min align-middle content-center"
          >
            <Image
              src={twitter}
              alt="twitter"
              className="flex self-center"
              draggable="false"
            />
          </a>
          <a
            href="https://github.com/AminoChain"
            className="flex h-min align-middle content-center"
          >
            <Image
              src={github}
              alt="github"
              className="flex self-center"
              draggable="false"
            />
          </a>
        </div>
        <div className="flex flex-row justify-between content-center self-center h-fit min-w-[220px] ">
          <p className="text-black font-satoshiMedium text-base">Contact</p>
          <div classNeme="flex content-center justify-center">
            <div className="flex h-fit py-[0.6rem] self-center">
              <Image src={dot} alt="." draggable="false" />
            </div>
          </div>
          <p className="text-black font-satoshiMedium text-base">FAQs</p>
          <div classNeme="flex content-center justify-center">
            <div className="flex h-fit py-[0.6rem] self-center">
              <Image src={dot} alt="." draggable="false" />
            </div>
          </div>
          <p className="text-black font-satoshiMedium text-base">Careers</p>
        </div>
      </div>
    </div>
  )
}

export default SearchFooter
