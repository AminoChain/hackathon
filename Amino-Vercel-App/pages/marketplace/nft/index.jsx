import NftListingPage from '../../../components/marketplace/marketplacePage/nftPath/NftListingPage'
import { gql, useQuery } from '@apollo/client'

export async function getServerSideProps(context) {
  const { tokenId, matchRating } = context.query

  return {
    props: { tokenId: tokenId, matchRating: matchRating }, // will be passed to the page component as props
  }
}

const Nft = ({ tokenId, matchRating }) => {
  const GET_TOKEN_DATA = gql`
    query Nft($tokenId: Int!) {
      existingTokenIds(where: { tokenId: $tokenId }) {
        tokenId
        price
        sizeInCC
        donor
        mintTimestamp
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
    data: listing,
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
    <div className="w-screen">
      <NftListingPage
        nftData={listing.existingTokenIds[0]}
        matchRating={matchRating}
      />
    </div>
  )
}

export default Nft
