import { network, deployments, ethers, run } from "hardhat"
import {
    AminoChainAuthenticator, AminoChainDonation, AminoChainMarketplace,
    IAminoChainDonation,
    Token,
} from "../../typechain"
import { assert, expect } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import {hla, HLA, hlaHash, hlaHashed, HLAHashed} from "../commons"
import {arrayify} from "ethers/lib/utils";
import {Encryptor} from "../encryptor";
// @ts-ignore
import {AminoChainLibrary, RegistrationDataStruct} from "../../typechain/contracts/AminoChainAuthenticator";

export const hlaEncodingKey = 'secret'


describe("Authenticator Integration Tests", async () => {
    let authenticator: AminoChainAuthenticator
    let marketplace: AminoChainMarketplace
    let owner: SignerWithAddress
    let buyer: SignerWithAddress
    let donor: SignerWithAddress
    let biobank: SignerWithAddress
    let usdc: Token
    let nft: AminoChainDonation
    let hlaHashed: HLAHashed

    before(async () => {
        await deployments.fixture(["all"])
        ;[owner, donor, buyer, biobank] = await ethers.getSigners()

        marketplace = await ethers.getContract("AminoChainMarketplace")
        nft = await ethers.getContract("AminoChainDonation")
        usdc = await ethers.getContract("USDC")
        await usdc.transfer(buyer.address, ethers.utils.parseUnits("42000", 6))

        authenticator = await ethers.getContract("AminoChainAuthenticator")
        await marketplace.setAuthenticatorAddress(authenticator.address)
        // await nft.setApprovalForAll(marketplace.address, true)
        await nft.transferOwnership(authenticator.address)

        hlaHashed = {
            A: ethers.utils.id(hla.A.toString()),
            B: ethers.utils.id(hla.B.toString()),
            C: ethers.utils.id(hla.C.toString()),
            DPB: ethers.utils.id(hla.DPB.toString()),
            DRB: ethers.utils.id(hla.DRB.toString()),
        }
    })

    after(async function () {
        // authenticator.removeAllListeners()
    })

    const amounts = [10, 5, 5, 2, 2, 2, 2, 2]

    let hlaHash: string

    it("Should create HLA hash", async () => {
        hlaHash = ethers.utils.id(JSON.stringify(hla))
        /*hlaHash = await authenticator.getBioDataHash(
            bioData.A.toString(),
            bioData.B.toString(),
            bioData.C.toString(),
            bioData.DPB.toString(),
            bioData.DRB.toString()
        )*/
        // @ts-ignore
        expect(hlaHash).correctHash()
    })

    it("Should be no registration data", async () => {
        expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(false)
    })

    let signature: string

    it("Donor side / Sign registration parameters hash", async () => {

        const registrationParametersHash = await authenticator.getRegistrationHash(
            donor.address,
            hlaHash
        )
        // @ts-ignore
        expect(hlaHash).correctHash()

        signature = await donor.signMessage(arrayify(registrationParametersHash))

        expect(signature.startsWith('0x')).true
        expect(signature).have.length(132)
    })

    const encryptor = new Encryptor(hlaEncodingKey)

    it("Backend / registration", async () => {
        const hlaEncodedBytes = encryptor.encrypt(JSON.stringify(hla))
        expect(hlaEncodedBytes).length(80)

        await authenticator.register({
            hlaHashed,
            hlaHash,
            hlaEncoded: hlaEncodedBytes,
            genomeEncodedIpfsId: '',
            amounts,
            donor: donor.address,
            biobank: biobank.address
        })
        expect(await authenticator.connect(donor).isRegistered(donor.address)).eq(true)
    })

    it("Decrypt HLA data", async () => {
        const storedBioDataEncoded = await nft.hlaHashToHlaEncoded(hlaHash)
        expect(storedBioDataEncoded).length(162)

        const encryptedBytes = ethers.utils.arrayify(storedBioDataEncoded)
        expect(encryptedBytes).length(80)

        const storedBioData = encryptor.decrypt(encryptedBytes)

        expect(storedBioData).eq(JSON.stringify(hla))
    })
})
