import { gql, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import MarketplaceProfileTx from './MarketplaceProfileTx'

const MarketplaceProfileHistory = () => {
  const [userAddress, setUserAddress] = useState(
    '0x0000000000000000000000000000000000000000'
  )
  const [totalEarnings, setTotalEarnings] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = await provider.getSigner()
        const signerAddr = await signer.getAddress()
        setUserAddress(signerAddr)
      } catch (e) {
        console.warn(e)
      }
    })()
  }, [])

  const GET_DONOR_EARNINGS = gql`
    query Nfts($userAddress: Bytes!) {
      saleCompleteds(where: { donor: $userAddress }) {
        timestamp
        transactionHash
        donorIncentive
        buyer
      }
    }
  `

  const {
    loading,
    error,
    data: sales,
  } = useQuery(GET_DONOR_EARNINGS, {
    variables: { userAddress },
  })
  if (loading) {
    return (
      <div>
        <h2 className="font-satoshiRegular text-black w-1/2">Loading...</h2>
      </div>
    )
  }
  if (error) return `Error! ${error}`

  let donorSalesArray = []
  let earnings = 0
  const getData = () => {
    sales.saleCompleteds.forEach((sale, index) => {
      donorSalesArray.push({
        date: sale.timestamp,
        transcationHash: sale.transactionHash,
        incentive: sale.donorIncentive,
        buyer: sale.buyer,
      })
      earnings =
        earnings + parseFloat(ethers.utils.formatUnits(sale.donorIncentive, 6))
    })
    if (totalEarnings !== earnings) {
      setTotalEarnings(earnings)
    }
  }
  getData()

  const numOfIncentives = donorSalesArray.length

  const earningTxs = donorSalesArray.map((item, index) => (
    <MarketplaceProfileTx key={index} item={item} />
  ))

  return (
    <div className="w-full flex flex-row px-20 py-5">
      {userAddress === '0x0000000000000000000000000000000000000000' ? (
        <div className="w-full justify-center flex px-auto font-satoshiMedium text-black text-4xl mt-[2rem] mb-[8%]">
          Connect Wallet To View Earnings
        </div>
      ) : (
        <div className="w-full flex flex-row flex-wrap">
          {numOfIncentives >= 1 ? (
            <div className="w-full flex flex-row flex-wrap">
              <div className="w-full flex flex-col">
                <div className="w-full flex rounded-[200px] border-t-[1px] border-b-[1px] border-main py-2 pl-8 mt-10">
                  <div className="font-satoshiMedium text-main basis-[30%]">
                    Date & Time
                  </div>
                  <div className="font-satoshiMedium text-main basis-[25%]">
                    Buyer Address
                  </div>
                  <div className=" font-satoshiMedium text-main basis-[30%]">
                    Amount
                  </div>
                  <div className=" font-satoshiMedium text-main ">Txn Hash</div>
                </div>
                <div className="flex flex-col">{earningTxs}</div>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col mt-[2rem] mb-[4%] items-center">
              <div className="font-satoshiMedium text-black text-4xl p-2">
                You have no purchases
              </div>
              <div className="text-black font-satoshiRegular text-xl p-2">
                Visit the Marketplace to buy your first order!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketplaceProfileHistory
