import { network, deployments, ethers, run } from "hardhat"
import {
    AminoChainAuthenticator,
    AminoChainMarketplace,
    AminoChainDonation,
    Token,
    LinkToken,
    MockOracle,
} from "../../typechain"
import { assert, expect } from "chai"
import {BigNumber, BigNumberish, constants} from "ethers"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {
    hla,
    HLAHashed,
    firstNftTokeId,
    amounts,
    DEFAULT_PRICE_PER_CC,
    hlaHashed,
    hlaHash,
    messageHash,
    signature, RegistrationData, mockHlaEncoded,
} from "../commons"
import { Encryptor } from "../encryptor"
import {arrayify} from "ethers/lib/utils";
// @ts-ignore
import PendingSaleStruct = AminoChainMarketplace.PendingSaleStruct;

const trueBoolInBytes = "0x0000000000000000000000000000000000000000000000000000000000000001"
const hlaEncodingKey = "secret"

describe("Full Tests", async function () {
    let authenticator: AminoChainAuthenticator
    let marketplace: AminoChainMarketplace
    let deployer: SignerWithAddress
    let doctor: SignerWithAddress
    let donor: SignerWithAddress
    let biobank: SignerWithAddress
    let test: SignerWithAddress
    let usdc: Token
    let nft: AminoChainDonation
    let mockOracle: MockOracle
    let linkToken: LinkToken

    async function beforeEachDescribe() {
        await deployments.fixture(["all"])
        ;[deployer, donor, doctor, biobank, test] = await ethers.getSigners()
        marketplace = (await ethers.getContract("AminoChainMarketplace")) as AminoChainMarketplace
        nft = (await ethers.getContract("AminoChainDonation")) as AminoChainDonation
        usdc = (await ethers.getContract("USDC")) as Token
        await usdc.transfer(doctor.address, ethers.utils.parseUnits("40000", 6))
        authenticator = (await ethers.getContract(
            "AminoChainAuthenticator"
        )) as AminoChainAuthenticator
        mockOracle = await ethers.getContract("MockOracle", deployer)
        linkToken = await ethers.getContract("LinkToken", deployer)
        await nft.transferOwnership(authenticator.address)
        await marketplace.setAuthenticatorAddress(authenticator.address)
        await linkToken.transfer(marketplace.address, ethers.utils.parseEther("10"))

        let usdcDecimals = await usdc.decimals()
        let amount = BigNumber.from(10).pow(usdcDecimals).mul(100_000)
        await usdc.transfer(doctor.address, amount)
    }

    describe("Buy happy path", async () => {
        before(beforeEachDescribe)

        const tokenId = firstNftTokeId
        const encryptor = new Encryptor(hlaEncodingKey)
        const bioDataEncodedBytes = encryptor.encrypt(JSON.stringify(hla))

        it("Mint & List", async () => {
            await expect(nft.ownerOf(tokenId)).revertedWith("ERC721: invalid token ID")
            expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(false)

            // Donor scan QR with biodataHash
            // On donor side, Authentication UI:

            await authenticator.register({
                hlaHashed,
                hlaHash,
                hlaEncoded: bioDataEncodedBytes,
                genomeEncodedIpfsId: '',
                amounts: [30],
                donor: donor.address,
                biobank: biobank.address
            })

            expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(true)
            expect(await nft.ownerOf(tokenId)).eq(authenticator.address)

            const listing = (await marketplace.getListingData(
                tokenId
            )) as AminoChainMarketplace.ListingStruct
            expect(listing.donor).eq(donor.address)
            expect(listing.bioBank).eq(biobank.address)
            expect(listing.sizeInCC).eq(30)
            expect(listing.price).eq(
                BigNumber.from(10)
                    .pow(await usdc.decimals())
                    .mul(30)
                    .mul(DEFAULT_PRICE_PER_CC)
            )
        })

        let prevDoctorUsdcBalance: BigNumber
        let price: BigNumberish

        it("Request Buy Access", async () => {
            const list = (await marketplace.getListingData(tokenId)) as AminoChainMarketplace.ListingStruct
            price = await list.price
            await usdc.connect(doctor).approve(marketplace.address, price)

            const requestTx = await marketplace.connect(doctor).requestBuyAccess()
            const requestTransactionReceipt = await requestTx.wait()
            const requestId = requestTransactionReceipt.events![0].args?.id
            await mockOracle.fulfillOracleRequest(requestId, trueBoolInBytes)

            prevDoctorUsdcBalance = await usdc.balanceOf(doctor.address)

            expect(prevDoctorUsdcBalance).greaterThanOrEqual(price)
            expect(await marketplace.i_usdc()).eq(usdc.address)
        })

        it("Start Buy process", async () => {
            await marketplace.connect(doctor).buyItem(tokenId)
            expect(await nft.ownerOf(tokenId)).eq(marketplace.address)
            expect(await usdc.balanceOf(doctor.address)).eq(prevDoctorUsdcBalance.sub(price))
        })

        it("Listing should be canceled", async () => {
            const listing = (await marketplace.getListingData(tokenId)) as AminoChainMarketplace.ListingStruct
            expect(listing.donor).eq(ethers.constants.AddressZero)
            expect(listing.bioBank).eq(ethers.constants.AddressZero)
        })

        it("Sale in pending", async () => {
            const pending: PendingSaleStruct = await marketplace.getPendingSaleData(tokenId)
            expect(pending.saleStatus).eq(0) // AT_ORIGIN
            expect(pending.seller).eq(authenticator.address)
            expect(pending.buyer).eq(doctor.address)
            expect(pending.escrowedPayment).eq(price)
        })

        it("Tracking Service / Sale status update to IN_TRANSIT", async () => {
            await marketplace.updateDeliveryStatus(tokenId, 1) // IN_TRANSIT

            const pending: PendingSaleStruct = await marketplace.getPendingSaleData(tokenId)
            expect(pending.saleStatus).eq(1) // IN_TRANSIT

            // add some checks here
        })

        it("Tracking Service / Sale status update to DELIVERED", async () => {
            await marketplace.updateDeliveryStatus(tokenId, 2) // DELIVERED

            const pending: PendingSaleStruct = await marketplace.getPendingSaleData(tokenId)
            expect(pending.saleStatus).eq(2) // DELIVERED
        })

        it("ChaiLink Automation agent / Call performUpkeep", async () => {
            const { upkeepNeeded, performData} = await marketplace.checkUpkeep(ethers.constants.HashZero)
            expect(upkeepNeeded).true
            expect(performData).not.empty

            expect(await marketplace.performUpkeep(performData))
                .with.emit(marketplace, "saleCompleted")
        })

        it("Sale should be completed", async () => {
            const pending: PendingSaleStruct = await marketplace.getPendingSaleData(tokenId)
            expect(pending.saleStatus).eq(0) // empty
            expect(pending.seller).eq(ethers.constants.AddressZero)
            expect(pending.buyer).eq(ethers.constants.AddressZero)
            expect(pending.escrowedPayment).eq(ethers.constants.AddressZero)

            expect(await usdc.balanceOf(donor.address)).eq(5_250_000_000)
            expect(await usdc.balanceOf(authenticator.address)).eq(4_200_000_000)
        })

        it("Withdraw", async () => {
            const prevReceiverBalance = await usdc.balanceOf(test.address)
            const amount = await usdc.balanceOf(authenticator.address)

            await authenticator.withdraw(test.address, amount)

            expect(await usdc.balanceOf(test.address)).eq(prevReceiverBalance.add(amount))
            expect(await usdc.balanceOf(authenticator.address)).eq(0)
        })
    })

    describe("Encoding", async () => {
        before(beforeEachDescribe)

        const encryptor = new Encryptor(hlaEncodingKey)
        const bioDataEncodedBytes = encryptor.encrypt(JSON.stringify(hla))

        it("Registering", async () => {

            const signature = await donor.signMessage(arrayify(messageHash))

            await authenticator.register({
                hlaHashed,
                hlaHash,
                hlaEncoded: bioDataEncodedBytes,
                genomeEncodedIpfsId: '',
                amounts: [30],
                donor: donor.address,
                biobank: biobank.address
            })

            expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(true)
        })

        it("Reading raw HLA", async () => {
            const storedBioDataEncoded = await nft.hlaHashToHlaEncoded(hlaHash)
            const storedBioData = encryptor.decrypt(arrayify(storedBioDataEncoded))

            expect(storedBioData).eq(JSON.stringify(hla))
        })
    })

    describe("Multiply fractions", async () => {
        before(beforeEachDescribe)

        it("Mint & List", async () => {
            const firstTokenId = firstNftTokeId
            const secondTokenId = firstNftTokeId + 1

            await expect(nft.ownerOf(firstTokenId)).revertedWith("ERC721: invalid token ID")
            await expect(nft.ownerOf(secondTokenId)).revertedWith("ERC721: invalid token ID")

            expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(false)

            await authenticator.register({
                hlaHashed,
                hlaHash,
                hlaEncoded: mockHlaEncoded,
                genomeEncodedIpfsId: '',
                amounts: [10, 20],
                donor: donor.address,
                biobank: biobank.address
            })

            expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(true)

            expect(await nft.ownerOf(firstTokenId)).eq(authenticator.address)
            expect(await nft.ownerOf(secondTokenId)).eq(authenticator.address)

            let listing = (await marketplace.getListingData(
                firstTokenId
            )) as AminoChainMarketplace.ListingStruct
            expect(listing.donor).eq(donor.address)
            expect(listing.bioBank).eq(biobank.address)
            expect(listing.sizeInCC).eq(10)

            listing = (await marketplace.getListingData(
                secondTokenId
            )) as AminoChainMarketplace.ListingStruct
            expect(listing.donor).eq(donor.address)
            expect(listing.bioBank).eq(biobank.address)
            expect(listing.sizeInCC).eq(20)
        })
    })

})
