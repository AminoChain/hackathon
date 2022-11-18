import Image from 'next/image'
import DonateBioBankCard from './DonateBioBankCard'

const DonateBioBankList = ({ bioBanks, setProgress, location }) => {
  const bioBankMatches = bioBanks.map((item, index) => (
    <DonateBioBankCard key={index} bioBank={item} setProgress={setProgress} />
  ))

  return (
    <div className="w-full">
      <div className="px-20 font-satoshiBold text-black text-2xl">
        {location}
      </div>
      <div className="w-full px-20 py-5 flex space-x-[4rem] flex-wrap">
        {bioBankMatches}
      </div>
    </div>
  )
}

export default DonateBioBankList
