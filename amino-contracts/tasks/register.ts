import { task } from "hardhat/config";
import {
    AminoChainAuthenticator__factory,
    AminoChainDonation__factory,
    AminoChainMarketplace__factory
} from "../typechain";

task("register", "").setAction(async (taskArgs, hre) => {
    const ethers = hre.ethers
    const [ deployer] = await ethers.getSigners()

    const nftFactory = (await ethers.getContractFactory("AminoChainDonation")) as AminoChainDonation__factory
    const nft = await nftFactory.attach('0x3dfF52834c6f242437Fc4bB960823b1a97Ab0aBC')

    const marketplaceFactory = (await ethers.getContractFactory("AminoChainMarketplace")) as AminoChainMarketplace__factory
    const marketplace = await marketplaceFactory.attach('0x2ed5fa6A174B7009476e17f11A3db20cBD3Ed726')

    const authenticatorFactory = (await ethers.getContractFactory("AminoChainAuthenticator")) as AminoChainAuthenticator__factory
    const authenticator = await authenticatorFactory.attach('0xe678C9BA5a9aE61fAc009a602b29ed869eD8156c')

    // await nft.transferOwnership(authenticator.address)
    await authenticator.setNftAddress(nft.address)
    if (await marketplace.tokenziedStemCells() != nft.address) await marketplace.setTokenizedStemCells(nft.address)
    if (await marketplace.authenticator() != authenticator.address) await marketplace.setAuthenticatorAddress(authenticator.address)

    // const encryptor = new Encryptor(process.env.PRIVATE_KEY as string)
    // const hlaEncodedBytes = encryptor.encrypt(JSON.stringify(hla))

    const hlaHash = '0xc69e9253e09dbcc132a1703674d67c398910241873892aafa3b1989931396a59'
    const donor = '0x3ef68eca339af002520a1ec0af7e940c7f0e0a9c'

    const registrationData = {
        hlaHashed: {
            "A": "0xb4ff4867cc79126826f7a227459583daf153a4c06ebe46aa70d02b5edf79bf90",
            "B": "0x4f78dcb8885880abdd79a0ee42acd93e663070f9f26bc0fc0c5f286292ed80b8",
            "C": "0x91a4b0333b4164454a16c893710e4d93be09adce949dd57b62045d9702889926",
            "DPB": "0x2bf8860cf9668ead6525698f0457f7848f42305ccbc59f6880f5eee34ac8283f",
            "DRB": "0x8a2488f5299e815401467583e7495c69909605d3670c05471bc064e9d0938228"
        },
        hlaHash,
        hlaEncoded,
        genomeEncodedIpfsId: 'bafybeihfkmtsraiwkdkb7pc7ltmmsiqawoozzbjtcanilbykpv6trj5m7y',
        amounts: [20, 10],
        donor,
        biobank: '0x35a5b80732eFe78D171327C39de408227C299AAc'
    }

    const tx = await authenticator.register(registrationData, { gasLimit: 1_000_000})

    await tx.wait()
})

const hlaEncoded = new Uint8Array([
    186,
    192,
    90,
    155,
    107,
    138,
    249,
    95,
    121,
    69,
    102,
    209,
    82,
    210,
    148,
    173,
    76,
    222,
    252,
    97,
    164,
    208,
    216,
    1,
    168,
    14,
    104,
    184,
    66,
    62,
    148,
    55,
    93,
    22,
    107,
    210,
    189,
    132,
    12,
    231,
    200,
    147,
    252,
    191,
    4,
    39,
    204,
    223,
    67,
    208,
    20,
    95,
    182,
    252,
    80,
    130,
    100,
    87,
    251,
    143,
    243,
    221,
    74,
    156,
    34,
    30,
    109,
    22,
    203,
    222,
    236,
    209,
    45,
    190,
    71,
    134,
    229,
    105,
    57,
    171
])