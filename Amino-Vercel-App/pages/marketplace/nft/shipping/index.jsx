import NftShipmentPage from '../../../../components/marketplace/marketplacePage/nftPath/shipping/NftShipmentPage'
import { gql, useQuery } from '@apollo/client'

export async function getServerSideProps(context) {
  const { tokenId } = context.query

  return {
    props: { tokenId: tokenId }, // will be passed to the page component as props
  }
}

const MarketplaceShipping = ({tokenId}) => {
  const GET_TOKEN_DATA = gql`
    query Nft($tokenId: Int!) {
      existingTokenIds(where: { tokenId: $tokenId }) {
        tokenId
        price
        sizeInCC
        donor
        bioBank
        hlaHashes {
          hlaHashed_A
          hlaHashed_B
          hlaHashed_C
          hlaHashed_DPB
          hlaHashed_DRB
        }
      }
    }
  `

  let id = Number(tokenId)
  const {
    loading,
    error,
    data: NftData,
  } = useQuery(GET_TOKEN_DATA, {
    variables: { tokenId: id },
  })

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }

  if (error) return `Error! ${error}`


  return (
    <div>
      <NftShipmentPage NftData={NftData} />
    </div>
  )
}

export default MarketplaceShipping
