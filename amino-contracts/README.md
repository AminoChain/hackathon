# AminoChain Contracts

- `yarn install` -- Install
- `yarn compile` -- Compile smart contracts
- `yarn test` -- Run tests
- `yarn deploy-[usdc|nft|marketplace|authenticator|mumbai]` -- Deployment scripts
- `yarn task-register` -- Registrate test donations 

# [AminoChainMarketplace](contracts/AminoChainMarketplace.sol)

Main Marketplace contract. Handles the sale of tokenized stem cells, delivery tracking and distributing incentives 
to biobanks and donors

# [AminoChainDonation](contracts/AminoChainDonation.sol)

NFT ERC-721 contract responsible for holding all donor/donation info

# [AminoChainAuthenticator](contracts/AminoChainAuthenticator.sol)

Responsible for the minting of tokenized stem cells and listing them on the marketplace. 
Also, for hold and withdraw protocol fees

