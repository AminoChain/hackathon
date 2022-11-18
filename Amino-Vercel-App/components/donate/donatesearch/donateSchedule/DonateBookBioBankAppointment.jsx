import DonateBioBankInfo from './DonateBioBankInfo'
import DonateScheduleAppointment from './DonateScheduleAppointment'
const DonateBookBioBankAppointment = ({ bioBank, setProgress }) => {
  return (
    <div className="flex flex-col px-20 py-5">
      <div className="px-2 pb-4 font-satoshiBold text-2xl pt-4 text-black">
        Appointment Details
      </div>
      <div className="bioBankAppointment rounded-[55px] flex">
        <DonateBioBankInfo bioBank={bioBank} />
        <DonateScheduleAppointment
          bioBank={bioBank}
          setProgress={setProgress}
        />
      </div>
    </div>
  )
}

export default DonateBookBioBankAppointment
