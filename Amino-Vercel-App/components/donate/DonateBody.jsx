import DonateSearchSteps from './donatesearch/DonateSearchSteps'
import DonateStart from './donatesearch/DonateStart'
import DonateSearch from './donatesearch/DonateSearch'
import DonateBioBankList from './donatesearch/DonateBioBankList'

const DonateBody = ({
  progress,
  setProgress,
  bioBanks,
  setBioBanks,
  location,
  setLocation,
}) => {
  return (
    <div className="w-screen">
      {progress > 0 ? <DonateSearchSteps progress={progress} /> : null}
      {(() => {
        switch (progress) {
          case 0:
            return <DonateStart setProgress={setProgress} />
          case 1:
            return (
              <DonateSearch
                location={location}
                setLocation={setLocation}
                setProgress={setProgress}
                setBioBanks={setBioBanks}
              />
            )
          case 2:
            return (
              <>
                <DonateSearch
                  location={location}
                  setLocation={setLocation}
                  setProgress={setProgress}
                  setBioBanks={setBioBanks}
                />
                <DonateBioBankList
                  location={location}
                  setProgress={setProgress}
                  bioBanks={bioBanks}
                />
              </>
            )
          default:
            return <div>Hello</div>
        }
      })()}
    </div>
  )
}

export default DonateBody
