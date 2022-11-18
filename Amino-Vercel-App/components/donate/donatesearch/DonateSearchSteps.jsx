const DonateSearchSteps = ({ progress }) => {
  const bar = (progress / 10) * 100

  return (
    <div className="w-full flex flex-col pt-[1rem]">
      <div className="w-full flex flex-row px-20">
        <div className="w-full flex flex-row items-start">
          <div
            className={`flex justify-center items-center ${
              progress > 3 ? 'bg-primary' : 'bg-main'
            } text-white text-base h-10 w-10 font-satoshiMedium rounded-full`}
          >
            1
          </div>
          <div className="flex flex-col justify-end text-black py-2 px-4">
            <div className="text-base font-satoshiMedium text-black">
              Book Appointment
            </div>
            <div className="text-sm font-satoshiMedium text-black">
              Choose a donation center as per your preference
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row items-start">
          <div
            className={`flex justify-center items-center ${
              progress > 3 ? `bg-main text-white` : `bg-white text-black`
            } text-base border border-main font-satoshiMedium h-10 w-10 rounded-full`}
          >
            2
          </div>
          <div className="flex flex-col justify-end text-black py-2 px-4">
            <div
              className={`text-base ${
                progress > 3 ? `text-black` : `text-main`
              } font-satoshiMedium`}
            >
              Visit center and verify donation
            </div>
            <div className="text-sm font-satoshiMedium text-black">
              Donate Stem Cells at the selected center
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-20 pt-[1rem]">
        <div className="w-full h-2 bg-slate-200 rounded">
          <div
            style={{ width: `${bar}%` }}
            className={`h-2 bg-primary rounded`}
          />
        </div>
      </div>
    </div>
  )
}

export default DonateSearchSteps
