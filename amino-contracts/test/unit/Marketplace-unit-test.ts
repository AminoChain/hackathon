import { deployments, ethers, getNamedAccounts } from "hardhat"
import { expect, assert } from "chai"
import {
    AminoChainMarketplace,
    MockERC20,
    LinkToken,
    MockOracle,
    AminoChainDonation,
} from "../../typechain"
import { firstNftTokeId, hlaHash, hlaHashed, mockHlaEncoded } from "../commons"

const trueBoolInBytes = "0x0000000000000000000000000000000000000000000000000000000000000001"
const defaultPrice = 1400

describe("AminoChainMarketplace Tests", async () => {
    let deployer: string
    let marketplace: AminoChainMarketplace
    let erc20: MockERC20
    let nft: AminoChainDonation
    let mockOracle: MockOracle
    let linkToken: LinkToken

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["mocks", "nft", "chainlink", "marketplace"])
        marketplace = await ethers.getContract("AminoChainMarketplace", deployer)
        nft = await ethers.getContract("AminoChainDonation", deployer)
        erc20 = await ethers.getContract("MockERC20", deployer)
        mockOracle = await ethers.getContract("MockOracle", deployer)
        linkToken = await ethers.getContract("LinkToken", deployer)
        await marketplace.setAuthenticatorAddress(deployer)
        await linkToken.transfer(marketplace.address, ethers.utils.parseEther("10"))
    })

    async function mint() {
        await nft.mint({
            donor: deployer,
            hlaHashed,
            hlaHash,
            hlaEncoded: mockHlaEncoded,
            genomeEncodedIpfsId: "",
            biobank: (await ethers.getSigners())[3].address,
            amounts: [5, 6, 3, 2, 1],
        })
        // await nft.mint(deployer, hlaHashed, [5, 6, 3, 2, 1])
    }

    async function list() {
        return await marketplace.listItem(firstNftTokeId, "30", defaultPrice, deployer, deployer)
    }

    describe("AminoChainMarketplace", async () => {
        it("sets variables", async () => {
            const rate = await marketplace.donorIncentiveRate()
            const owner = await marketplace.owner()
            const usdc = await marketplace.i_usdc()

            const tokenized = await marketplace.tokenziedStemCells()

            assert.equal(rate.toString(), "8")
            assert.equal(owner, deployer)
            assert.equal(usdc, erc20.address)
            assert.equal(tokenized, nft.address)
        })
    })
    describe("listItem", async () => {
        // fixme
        /*it("fails if user doesn't own item", async () => {
            const signers = await ethers.getSigners()
            nft = await nft.connect(signers[1])
            await nft.mint(
                signers[1].address,
                { A: [0], B: [0], C: [0], DPB: [0], DRB: [0] },
                [6, 5, 2, 4, 3]
            )
            nft = await nft.connect(signers[0])

            await expect(
                marketplace.listItem(firstNftTokeId, "30", deployer, deployer)
            ).to.be.revertedWith(`Ownable: caller is not the owner`)
        })*/

        it("fails if token is already listed by user", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            await expect(
                marketplace.listItem(firstNftTokeId, "30", defaultPrice, deployer, deployer)
            ).to.be.revertedWith("Token is already listed")
        })

        it("fails if the bioBank is not set set to null", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)

            await expect(
                marketplace.listItem(
                    firstNftTokeId,
                    "30",
                    defaultPrice,
                    deployer,
                    "0x0000000000000000000000000000000000000000"
                )
            ).to.be.revertedWith("BioBank cannot be null")
        })

        it("fails if the user does not approve the marketplace", async () => {
            await mint()

            await expect(
                marketplace.listItem(firstNftTokeId, "30", defaultPrice, deployer, deployer)
            ).to.be.revertedWith("Marketplace does not have approval from lister on NFT contract")
        })

        it("Updates listing varibles", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            const listing = await marketplace.getListingData(firstNftTokeId)

            assert.equal(listing.seller, deployer)
            assert.equal(listing.price.toString(), ethers.utils.parseUnits("42000", 6).toString())
            assert.equal(listing.donor, deployer)
            assert.equal(listing.bioBank, deployer)
        })

        it("emits an event with correct data", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            const tx = await list()
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.seller, deployer)
            assert.equal(transactionReceipt.events![0].args?.tokenId.toString(), firstNftTokeId)
            assert.equal(
                transactionReceipt.events![0].args?.price.toString(),
                ethers.utils.parseUnits("42000", 6).toString()
            )
            assert.equal(transactionReceipt.events![0].args?.donor, deployer)
            assert.equal(transactionReceipt.events![0].args?.bioBank, deployer)
        })
    })
    describe("buyItem", async () => {
        it("fails if token is not listed", async () => {
            const signers = await ethers.getSigners()

            await mint()
            marketplace = await marketplace.connect(signers[1])

            expect(marketplace.buyItem(firstNftTokeId)).to.be.revertedWith("Token is not listed")
        })

        it("fails if buyer is not approved as doctor or reseacher", async () => {
            const signers = await ethers.getSigners()

            await mint()

            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            marketplace = await marketplace.connect(signers[1])

            expect(marketplace.buyItem(firstNftTokeId)).to.be.revertedWith(
                "Msg sender is not approved to buy"
            )
        })

        it("fails if token seller tries to buy their item", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            expect(marketplace.buyItem(firstNftTokeId)).to.be.revertedWith(
                "Token seller cannot buy their token"
            )
        })

        it("fails if buyer doesnt have enough USDC", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()
            marketplace = await marketplace.connect(signers[1])

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            expect(marketplace.buyItem(firstNftTokeId)).to.be.revertedWith(
                "Buyer's USDC balence is too low"
            )
        })

        it("fails if buyer doesnt give sufficent USDC approval to contract", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()
            marketplace = await marketplace.connect(signers[1])
            erc20 = await erc20.connect(signers[1])
            await erc20.deposit({ value: ethers.utils.parseEther("1000000") })

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            expect(marketplace.buyItem(firstNftTokeId)).to.be.revertedWith(
                "Marketplace allowance from buyer on USDC contract must be higher than listing price"
            )
        })

        it("puts USDC payment and NFT into escrow", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await marketplace.listItem(
                firstNftTokeId,
                "30",
                defaultPrice,
                signers[2].address,
                signers[3].address
            )

            marketplace = await marketplace.connect(signers[1])
            erc20 = await erc20.connect(signers[1])
            await erc20.deposit({ value: ethers.utils.parseUnits("1000000", 6) })
            await erc20.approve(marketplace.address, ethers.utils.parseUnits("1000000", 6))

            const preMarketBal = await erc20.balanceOf(marketplace.address)

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            await marketplace.buyItem(firstNftTokeId)

            const postMarketBal = await erc20.balanceOf(marketplace.address)
            const nftOwner = await nft.ownerOf(firstNftTokeId)

            assert.equal(
                postMarketBal.sub(preMarketBal).toString(),
                ethers.utils.parseUnits("42000", 6).toString()
            )
            assert.equal(nftOwner, marketplace.address)
        })

        it("emits an event with the correct data", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await marketplace.listItem(
                firstNftTokeId,
                "30",
                defaultPrice,
                signers[2].address,
                deployer
            )

            marketplace = await marketplace.connect(signers[1])
            erc20 = await erc20.connect(signers[1])
            await erc20.deposit({ value: ethers.utils.parseUnits("1000000", 6) })
            await erc20.approve(marketplace.address, ethers.utils.parseUnits("1000000", 6))

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            const tx = await marketplace.buyItem(firstNftTokeId)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![3].args?.tokenId, firstNftTokeId)
            assert.equal(transactionReceipt.events![3].args?.buyer, signers[1].address)
            assert.equal(
                transactionReceipt.events![3].args?.escrowedPrice.toString(),
                ethers.utils.parseUnits("42000", 6).toString()
            )
            assert.equal(transactionReceipt.events![3].args?.sizeInCC.toString(), "30")
            assert.equal(transactionReceipt.events![3].args?.donor, signers[2].address)
            assert.equal(transactionReceipt.events![3].args?.bioBank, deployer)
        })

        it("deletes listing data", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await marketplace.listItem(
                firstNftTokeId,
                "30",
                defaultPrice,
                signers[2].address,
                deployer
            )

            marketplace = await marketplace.connect(signers[1])
            erc20 = await erc20.connect(signers[1])
            await erc20.deposit({ value: ethers.utils.parseUnits("1000000", 6) })
            await erc20.approve(marketplace.address, ethers.utils.parseUnits("1000000", 6))

            const requestTx = await marketplace.requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            await marketplace.buyItem(firstNftTokeId)
            const listing = await marketplace.getListingData(firstNftTokeId)

            assert.equal(listing.seller, "0x0000000000000000000000000000000000000000")
        })
    })
    describe("cancelListing", async () => {
        it("fails if item does not exist", async () => {
            await mint()

            expect(marketplace.cancelListing(0)).to.be.revertedWith(
                "Only lister can cancel their listing"
            )
        })

        it("deletes listing variables", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            await marketplace.cancelListing(firstNftTokeId)
            const listing = await marketplace.getListingData(firstNftTokeId)

            assert.equal(listing.seller, "0x0000000000000000000000000000000000000000")
        })

        it("emits event with the correct data", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            const tx = await marketplace.cancelListing(firstNftTokeId)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.tokenId, firstNftTokeId)
        })
    })
    describe("updateListing", async () => {
        it("fails if item is not listed", async () => {
            await mint()

            expect(
                marketplace.updateListing(firstNftTokeId, ethers.utils.parseEther("2"))
            ).to.be.revertedWith("Only lister can update their listing")
        })

        it("fails if old listing price is the same as new", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            expect(
                marketplace.updateListing(firstNftTokeId, ethers.utils.parseEther("1"))
            ).to.be.revertedWith("Old price cannot be the same as the new")
        })

        it("updates listing price", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            await marketplace.updateListing(firstNftTokeId, ethers.utils.parseEther("0.5"))
            const listing = await marketplace.getListingData(firstNftTokeId)

            assert.equal(listing.price.toString(), ethers.utils.parseEther("0.5").toString())
        })

        it("emits event with the correct data", async () => {
            const signers = await ethers.getSigners()
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            const tx = await marketplace.updateListing(
                firstNftTokeId,
                ethers.utils.parseEther("0.5")
            )
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.seller, signers[0].address)
            assert.equal(transactionReceipt.events![0].args?.tokenId, firstNftTokeId)
            assert.equal(
                transactionReceipt.events![0].args?.price.toString(),
                ethers.utils.parseEther("0.5").toString()
            )
            assert.equal(transactionReceipt.events![0].args?.donor, deployer)
            assert.equal(transactionReceipt.events![0].args?.bioBank, deployer)
        })
    })
    describe("transferOwnership", async () => {
        it("fails if the old owner is the same as the new", async () => {
            expect(marketplace.transferOwnership(deployer)).to.be.revertedWith(
                "New address is already owner"
            )
        })

        it("sets the owner variable to the new owner", async () => {
            const signers = await ethers.getSigners()
            await marketplace.transferOwnership(signers[1].address)

            const owner = await marketplace.owner()

            assert.equal(owner, signers[1].address)
        })

        it("emits an event with the correct data", async () => {
            const signers = await ethers.getSigners()

            const tx = await marketplace.transferOwnership(signers[1].address)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.oldOwner, deployer)
            assert.equal(transactionReceipt.events![0].args?.newOwner, signers[1].address)
        })
    })
    describe("setTokenizedStemCells", async () => {
        it("fails if the new address is the same as the old", async () => {
            expect(marketplace.setTokenizedStemCells(nft.address)).to.be.revertedWith(
                "New address is already set"
            )
        })

        it("sets the tokenized stem cells variable to the new address", async () => {
            await marketplace.setTokenizedStemCells(erc20.address)

            const address = await marketplace.tokenziedStemCells()

            assert.equal(address, erc20.address)
        })

        it("emits an event with the correct data", async () => {
            const tx = await marketplace.setTokenizedStemCells(erc20.address)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.stemCells, erc20.address)
        })
    })
    describe("setAuthenticatorAddress", async () => {
        it("fails if the new address is the same as the old", async () => {
            expect(marketplace.setAuthenticatorAddress(deployer)).to.be.revertedWith(
                "New address is already set"
            )
        })

        it("sets the authenticator variable to the new address", async () => {
            const signers = await ethers.getSigners()
            await marketplace.setAuthenticatorAddress(signers[1].address)

            const address = await marketplace.authenticator()

            assert.equal(address, signers[1].address)
        })

        it("emits an event with the correct data", async () => {
            const signers = await ethers.getSigners()
            const tx = await marketplace.setAuthenticatorAddress(signers[1].address)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.authenticator, signers[1].address)
        })
    })
    describe("setDonorIncentiveRate", async () => {
        it("fails if the new incentive rate is the same as the old", async () => {
            expect(marketplace.setDonorIncentiveRate(8)).to.be.revertedWith(
                "New address is already set"
            )
        })

        it("sets the donor incentive rate variable to the new rate", async () => {
            await marketplace.setDonorIncentiveRate(16)

            const rate = await marketplace.donorIncentiveRate()

            assert.equal(rate.toString(), "16")
        })

        it("emits an event with the correct data", async () => {
            const tx = await marketplace.setDonorIncentiveRate(16)
            const transactionReceipt = await tx.wait()

            assert.equal(transactionReceipt.events![0].args?.newIncentiveRate, 16)
        })
    })
    describe("getListingData", async () => {
        it("retrives the correct data", async () => {
            await mint()
            await nft.setApprovalForAll(marketplace.address, true)
            await list()

            const data = await marketplace.getListingData(firstNftTokeId)

            assert.equal(data.seller, deployer)
            assert.equal(data.price.toString(), ethers.utils.parseUnits("42000", 6).toString())
            assert.equal(data.donor, deployer)
            assert.equal(data.bioBank, deployer)
        })
    })
})
