import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService"

// 0x7d351a67CCA0955839D2e515d326125343D9780B

const deployAuthenticator: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    let nftAddress
    let marketplaceAddress
    let usdcAddress

    if (developmentChains.includes(network.name)) {
        const USDC = await ethers.getContract("USDC")
        usdcAddress = USDC.address
        const NFT = await ethers.getContract("AminoChainDonation")
        nftAddress = NFT.address
        const marketplace = await ethers.getContract("AminoChainMarketplace")

        marketplaceAddress = marketplace.address
    } else {
        usdcAddress = "0x3F7a078C98EB0d0E58EEaC1a2C94183300B345ac" // todo lets create some registry for deployed contracts addresses
        nftAddress = "0xE6C8610d8C6638fa7088186f29dceC474f1518C2"
        marketplaceAddress = "0x2ed5fa6A174B7009476e17f11A3db20cBD3Ed726"
    }

    const constructorArgs = [nftAddress, marketplaceAddress, usdcAddress]

    const contract = await deploy("AminoChainAuthenticator", {
        from: deployer,
        // gasLimit: 20000000,
        args: constructorArgs,
        log: true,
    })

    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        console.log("Verifying on polygonscan...")
        await delay(20000)
        await verify(
            contract.address,
            "contracts/AminoChainAuthenticator.sol:AminoChainAuthenticator",
            constructorArgs
        ) /*.catch( () => {})*/
    }
}

export default deployAuthenticator
deployAuthenticator.tags = [`all`, `authenticator`]
