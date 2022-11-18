import DonateNav from '../DonateNav'
import DonateFooter from '../DonateFooter'
import DonorEarningsBody from './DonorEarningsBody'

const DonorEarnings = () => {
  return (
    <div className="w-full">
      <DonateNav />
      <DonorEarningsBody />
      <DonateFooter />
    </div>
  )
}

export default DonorEarnings
