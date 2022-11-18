import DonateFooter from '../../DonateFooter'
import DonateNav from '../../DonateNav'
import DonateBookBioBankAppointment from './DonateBookBioBankAppointment'
import { useState, useEffect } from 'react'
import DonateSearchSteps from '../DonateSearchSteps'

const DonateBioBankPage = ({ bioBank, progress, setProgress }) => {
  // const [bioBank, setBioBank] = useState({})
  // useEffect(async () => {
  //   const getBioBank = async () => {

  //   await getBioBank()
  // }, [])

  return (
    <div className=''>
      <DonateNav />
      <DonateSearchSteps progress={progress} />
      <DonateBookBioBankAppointment
        bioBank={bioBank}
        setProgress={setProgress}
      />
      <DonateFooter />
    </div>
  )
}

export default DonateBioBankPage
