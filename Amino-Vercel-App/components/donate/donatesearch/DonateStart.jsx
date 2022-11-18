const DonateStart = ({ progress, setProgress }) => {
  const increaseProgress = () => {
    setProgress(1)
  }

  return (
    <section className="flex flex-col items-center mt-[2rem]">
      <div className="text-4xl text-black font-satoshiMedium p-2">
        Ready to donate?
      </div>
      <div className="text-black font-satoshiRegular text-xl p-2">
        Get paid when your Stem Cells are purchased
      </div>
      <div className="py-5 cursor-pointer" onClick={increaseProgress}>
        <div className="h-14 flex justify-between font-satoshiBold cursor-pointer text-black text-2xl items-center rounded-full px-10 py-5 drop-shadow-donatebuttonIntroShadow bg-gradient-to-r from-gradientDonateStart to-gradientDonateEnd">
          Start Donation
        </div>
      </div>
    </section>
  )
}

export default DonateStart
