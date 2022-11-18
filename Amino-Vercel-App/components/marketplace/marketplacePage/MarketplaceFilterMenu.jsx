import { ethers } from "ethers"


const MarketplaceFilterMenu = ({ setMatchFilter, matchFilter}) => {

  const MATCH_RATING_FILTER = {
    0: '0-25',
    1: '25-50',
    2: '50-75',
    3: '75-100',
  }

  const setMatchRatingFilter = (value) => {
    setMatchFilter(MATCH_RATING_FILTER[value])
  }

  return (
    <div className="flex flex-row justify-between border-solid border-y-[1px] rounded-2xl border-main py-6 px-6 mt-6 align-middle">
            <div className="flex flex-col">
              <p className="font-satoshiRegular mb-2 text-black text-xl">
                Match rating
              </p>
              <div className="flex flex-row">
                <div
                  className="flex flex-row border-solid border rounded-full border-main py-2 px-4 cursor-pointer mr-4"
                  onClick={() => {
                    setMatchRatingFilter(0)
                  }}
                >
                  <div
                    className={`rounded-full ${
                      matchFilter === MATCH_RATING_FILTER[0] ? 'bg-black' : ''
                    } border-main border-solid border h-4 w-4 self-center mr-2`}
                  />
                  <p className="font-satoshiMedium text-base text-main">
                    0-25%
                  </p>
                </div>
                <div
                  className="flex flex-row border-solid border rounded-full border-main py-2 px-4 cursor-pointer mr-4"
                  onClick={() => {
                    setMatchRatingFilter(1)
                  }}
                >
                  <div
                    className={`rounded-full ${
                      matchFilter === MATCH_RATING_FILTER[1]
                        ? 'bg-black'
                        : 'bg-transparent'
                    } border-main border-solid border h-4 w-4 self-center mr-2`}
                  />
                  <p className="font-satoshiMedium text-base text-main">
                    25-50%
                  </p>
                </div>
                <div
                  className="flex flex-row border-solid border rounded-full border-main py-2 px-4 cursor-pointer mr-4"
                  onClick={() => {
                    setMatchRatingFilter(2)
                  }}
                >
                  <div
                    className={`rounded-full ${
                      matchFilter === MATCH_RATING_FILTER[2]
                        ? 'bg-black'
                        : 'bg-transparent'
                    } border-main border-solid border h-4 w-4 self-center mr-2`}
                  />
                  <p className="font-satoshiMedium text-base text-main">
                    50-75%
                  </p>
                </div>
                <div
                  className="flex flex-row border-solid border rounded-full border-main py-2 px-4 cursor-pointer mr-4"
                  onClick={() => {
                    setMatchRatingFilter(3)
                  }}
                >
                  <div
                    className={`rounded-full ${
                      matchFilter === MATCH_RATING_FILTER[3]
                        ? 'bg-black'
                        : 'bg-transparent'
                    } border-main border-solid border h-4 w-4 self-center mr-2`}
                  />
                  <p className="font-satoshiMedium text-base text-main">
                    75-100%
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col self-center w-1/2">
              <p className="font-satoshiRegular mb-3 text-black text-xl">
                Price ($USD)
              </p>
              <div className="flex flex-row align-middle">
                <div className="h-2 w-1/2 bg-priceSlider rounded-full self-center mr-4 cursor-pointer">
                  <div className="flex h-2 w-1/2 rounded-full bg-main justify-end">
                    <div className="h-4 w-4 bg-black rounded-full self-center cursor-pointer" />
                  </div>
                </div>
                <p className="font-satoshiMedium text-main text-[16]">
                  $0 - $
                  {parseFloat(
                    ethers.utils.formatUnits(highestPrice, 18)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
  )
}

export default MarketplaceFilterMenu