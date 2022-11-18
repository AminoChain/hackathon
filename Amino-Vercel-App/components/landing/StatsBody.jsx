import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'
import { ethers } from 'ethers'

const StatsBody = () => {
  const [totalIncentivesPaid, setTotalIncentivesPaid] = useState(0)
  const [totalStemCellsDelivered, setTotalStemCellsDelivered] = useState(0)
  const [totalTokenizedStemCells, setTotalTokenizedStemCells] = useState(0)

  function MoneyFormat(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e9
      ? Math.abs(Number(labelValue)) / 1.0e9 + 'B'
      : // Six Zeroes for Millions
      Math.abs(Number(labelValue)) >= 1.0e6
      ? Math.abs(Number(labelValue)) / 1.0e6 + 'M'
      : Math.abs(Number(labelValue))
  }

  const GET_MINTED_NFTS = gql`
    {
      existingTokenIds {
        tokenId
      }
    }
  `
  const GET_COMPLETED_SALES = gql`
    {
      saleCompleteds {
        donorIncentive
      }
    }
  `

  const { loading, error, data: listing } = useQuery(GET_MINTED_NFTS)
  const { loading1, error1, data: sales } = useQuery(GET_COMPLETED_SALES)

  if (loading || loading1) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }
  if (error) return `Error! ${error}`
  if (error1) return `Error! ${error1}`

  let incentives = 0
  let cellsDelivered = 0
  let cellsTokenized = 0
  const getData = () => {
    try {
      sales.saleCompleteds.forEach((sale, index) => {
        incentives =
          incentives +
          parseFloat(ethers.utils.formatUnits(sale.donorIncentive, 6))
        cellsDelivered++
      })
      listing.existingTokenIds.forEach((token, index) => {
        cellsTokenized++
      })
      if (totalIncentivesPaid !== incentives) {
        setTotalIncentivesPaid(incentives)
      }
      if (totalStemCellsDelivered !== cellsDelivered) {
        setTotalStemCellsDelivered(cellsDelivered)
      }
      if (totalTokenizedStemCells !== cellsTokenized) {
        setTotalTokenizedStemCells(cellsTokenized)
      }
    } catch (e) {
      console.warn(e)
    }
  }
  getData()

  return (
    <div className="flex w-full bg-center px-[10%] mt-20">
      <div className="flex w-full p-16 justify-evenly align-middle text-center border-solid border-x-[1px] rounded-3xl border-main">
        <div className="flex flex-col ">
          <p className="font-satoshiBlack text-black text-3xl">
            {cellsTokenized}
          </p>
          <p className="text-2xl  text-black font-satoshiRegular pt-4">
            Tokenized Donations
          </p>
        </div>
        <div className="flex flex-col">
          {totalIncentivesPaid < 1000000 ? (
            <p className="font-satoshiBlack text-black text-3xl">
              ${parseFloat(totalIncentivesPaid).toLocaleString()}
            </p>
          ) : (
            <p className="font-satoshiBlack text-black text-3xl">
              $
              {parseFloat(MoneyFormat(totalIncentivesPaid)).toLocaleString() +
                MoneyFormat(totalIncentivesPaid).replace(/[^B|M|K]/g, '')}
            </p>
          )}
          <p className="text-2xl text-black font-satoshiRegular pt-4">
            Incentives Paid
          </p>
        </div>
        <div className="flex flex-col">
          <p className="font-satoshiBlack text-black text-3xl">
            {totalStemCellsDelivered}
          </p>
          <p className="text-2xl text-black font-satoshiRegular pt-4">
            Stem Cells Delivered
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatsBody
