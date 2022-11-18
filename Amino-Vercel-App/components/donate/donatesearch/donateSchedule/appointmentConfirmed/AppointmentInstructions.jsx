import Image from 'next/image'
import AppointmentDetails from './AppointmentDetails'
import AppointmentVisit from './AppointmentVisit'

const AppointmentInstructions = ({ bioBank }) => {
  return (
    <div className="w-full flex px-20 pt-5">
      <AppointmentVisit bioBank={bioBank} />
      <AppointmentDetails bioBank={bioBank}/>
    </div>
  )
}

export default AppointmentInstructions
