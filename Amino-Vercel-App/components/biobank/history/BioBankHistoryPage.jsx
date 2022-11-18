import BioBankBanner from '../BioBankBanner'
import BioBankFooter from '../BioBankFooter'
import BioBankNav from '../BioBankNav'
import BioBankHistoryList from './BioBankHistoryList'

const BioBankHistoryPage = () => {

  return (
    <div className='w-full'>
      <BioBankBanner />
      <BioBankNav />
      <BioBankHistoryList/>
      <BioBankFooter/>
    </div>
  )
}

export default BioBankHistoryPage
