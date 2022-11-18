import Link from 'next/link'
import DonateNav from './DonateNav'
import DonateBody from './DonateBody'
import DonorFooter from './DonateFooter'
import { useState } from 'react'

const DonatePage = () => {
  const [progress, setProgress] = useState(0)
  const [bioBanks, setBioBanks] = useState([])
  const [location, setLocation] = useState('')

  return (
    <div className="w-screen flex flex-col">
      <DonateNav />
      <DonateBody
        progress={progress}
        setProgress={setProgress}
        bioBanks={bioBanks}
        setBioBanks={setBioBanks}
        location={location}
        setLocation={setLocation}
      />
      <DonorFooter />
    </div>
  )
}

export default DonatePage
