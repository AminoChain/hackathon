import BioBankNav from '../BioBankNav'
import BioBankBanner from '../BioBankBanner'
import BioBankAppointmentList from './BioBankAppointmentList'
import BioBankFooter from '../BioBankFooter'

const BioBankAppointmentPage = () => {
  return (
    <div className="w-screen">
      <BioBankBanner />
      <BioBankNav />
      <BioBankAppointmentList />
      <BioBankFooter />
    </div>
  )
}

export default BioBankAppointmentPage
