import BioBankNav from '../BioBankNav'
import BioBankBanner from '../BioBankBanner'
import BioBankFooter from '../BioBankFooter'
import BioBankDetailsBody from './BioBankDetailsBody'

const BioBankDetailsPage = () => {
  return (
    <div className="w-screen">
      <BioBankBanner />
      <BioBankNav />
      <BioBankDetailsBody />
      <BioBankFooter />
    </div>
  )
}

export default BioBankDetailsPage
