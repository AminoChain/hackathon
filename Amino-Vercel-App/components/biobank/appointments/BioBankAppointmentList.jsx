import BioBankAppointment from './BioBankAppointment'

const BioBankAppointmentList = () => {
  let appointments = [1, 2, 3, 4, 5, 6, 7, 8]

  const appointmentList = appointments.map((item, index) => (
    <BioBankAppointment key={index} />
  ))
  return (
    <div className="w-full px-20">
      <div className="w-full flex rounded-full border-t-[1px] border-b-[1px] border-main py-2 px-8">
        <div className=" font-satoshiMedium text-main basis-3/12">
          Date & Time
        </div>
        <div className=" font-satoshiMedium text-main basis-7/12">
          Donor address
        </div>
        <div className=" font-satoshiMedium text-main basis-2/12 flex justify-center">
          Action
        </div>
      </div>
      <div>{appointmentList}</div>
    </div>
  )
}

export default BioBankAppointmentList
