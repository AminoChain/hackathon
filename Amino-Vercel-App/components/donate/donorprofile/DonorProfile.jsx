import DonateNav from '../DonateNav'
import DonateFooter from '../DonateFooter'
import DonorProfileBody from './DonorProfileBody'

const DonorProfile = () => {
  return (
    <div className="w-full">
      <DonateNav />
      <DonorProfileBody />
      <DonateFooter />
    </div>
  )
}

export default DonorProfile
