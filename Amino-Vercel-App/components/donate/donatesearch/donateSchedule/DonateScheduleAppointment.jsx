import { useRouter } from 'next/router'

const DonateScheduleAppointment = ({ bioBank, setProgress }) => {
  const router = useRouter()
  let months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  let days = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
  ]
  let times = [
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
  ]
  let ampm = ['AM', 'PM']
  const appointmentInput = (e) => {
    e.preventDefault()

    // let HLAA, HLAB, HLAC, HLADPB, HLADRB
    // if (e.currentTarget[0].value) {
    //     HLAA = JSON.parse(e.currentTarget[0].value) //e.target[0];
    // } else {
    //     HLAA = [0]
    // }
    // if (e.currentTarget[1].value) {
    //     HLAB = JSON.parse(e.currentTarget[1].value)
    // } else {
    //     HLAB = [0]
    // }
    // if (e.currentTarget[2].value) {
    //     HLAC = JSON.parse(e.currentTarget[2].value)
    // } else {
    //     HLAC = [0]
    // }
    // if (e.currentTarget[3].value) {
    //     HLADPB = JSON.parse(e.currentTarget[3].value)
    // } else {
    //     HLADPB = [0]
    // }
    // if (e.currentTarget[4].value) {
    //     HLADRB = JSON.parse(e.currentTarget[4].value)
    // } else {
    //     HLADRB = [0]
    // }

    let month = 'jan'
    let day = 1
    let time = new Date()
    const appointment = {
      month: month,
      day: day,
      day: time,
    }
    const url = `/donate/biobank/appointmentConfirmed?bioBankId=${bioBank.id}`
    //for now we will route to the confirmationpage
    setProgress(4)
    router.push(url)
    // ADD functionality to submit to the database for the schedule to be sent to the bio bank
  }

  return (
    <div className="w-3/4 flex flex-col p-20">
      <form onSubmit={appointmentInput}>
        <div className="bioBankAppointment rounded-[12px] px-6 py-7">
          <div className="border-b-2">
            <div className=" font-satoshiBold text-[16px] text-black pb-4">
              Book appointment
            </div>
          </div>
          <div className="flex w-full">
            <div className="w-full flex justify-start py-5">
              <div className="flex flex-col pl-2 ">
                <div className=" font-satoshiMedium text-black pb-2 text-[16px]">
                  Date
                </div>
                <div>
                  <select
                    id="months"
                    name="months"
                    className="border p-2 px-10 rounded font-satoshiRegular border-main text-black"
                  >
                    {months.map((element) => {
                      return (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </select>
                  <select
                    id="day"
                    name="day"
                    className="border p-2 mx-2 px-10 rounded font-satoshiRegular border-main text-black"
                  >
                    {days.map((element) => {
                      return (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="flex flex-col pl-10">
                <div className=" font-satoshiMedium text-black pb-2 text-[16px]">
                  Time
                </div>
                <div>
                  <select
                    id="months"
                    name="months"
                    className="border p-2 px-10 rounded font-satoshiRegular border-main text-black"
                  >
                    {times.map((element) => {
                      return (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </select>
                  <select
                    id="day"
                    name="day"
                    className="border p-2 mx-2 px-10 rounded font-satoshiRegular border-main text-black"
                  >
                    {ampm.map((element) => {
                      return (
                        <option key={element} value={element}>
                          {element}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bioBankAppointment rounded-[12px] px-6 py-7 my-4">
          <div className="border-b-2">
            <div className=" font-satoshiBold text-[16px] text-black pb-4">
              Confirmation
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className=" font-satoshiMedium text-black py-4">
              Your appointment is confirmed for Nov 1st, at 10:30 AM
            </div>
            <div className=" font-satoshiMedium text-main">
              Please be on time and carry the valid documents
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-5">
          <input
            className="flex justify-items-center text-2xl cursor-pointer bg-marketplaceButton font-satoshiBold px-[6rem] mt-[1rem] h-[72px] rounded-full text-black drop-shadow-searchButtonShadow "
            name="submit"
            type="submit"
            value="Confirm Booking"
          />
        </div>
      </form>
    </div>
  )
}

export default DonateScheduleAppointment
