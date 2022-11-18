import BioBankRegisterPage from '../../../../components/biobank/appointments/register/BioBankRegisterPage'
import { useState } from 'react'

const BioBankRegister = () => {
  const [hla, setHla] = useState()

  return (
    <div>
      <BioBankRegisterPage setHla={setHla} hla={hla} />
    </div>
  )
}

export default BioBankRegister
