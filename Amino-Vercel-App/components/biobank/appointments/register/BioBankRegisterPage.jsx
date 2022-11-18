import EnterHlaPage from './enterHlaPage/EnterHlaPage'
import DonorApprovePage from './donorApprovePage/DonorApprovePage'
import BioBankBanner from '../../BioBankBanner'
import BioBankNav from '../../BioBankNav'
import BioBankFooter from '../../BioBankFooter'
import { useRouter } from 'next/router'

const BioBankRegisterPage = ({hla, setHla}) => {
 
  const { pathname } = useRouter()

  return (
    <div className="w-full">
      <BioBankBanner />
      {/* {pathname == "/biobank/appointments/register" ? null : <BioBankNav /> } */}
      {!hla ? (
        <EnterHlaPage setHla={setHla} />
      ) : (
        <DonorApprovePage
          hla={hla}
          biobankAddress={'0x35a5b80732eFe78D171327C39de408227C299AAc'}
        />
      )}
      <BioBankFooter />
    </div>
  )
}

export default BioBankRegisterPage
