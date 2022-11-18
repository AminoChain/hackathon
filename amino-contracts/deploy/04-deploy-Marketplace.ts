import { HardhatRuntimeEnvironment } from "hardhat/types"
import { DeployFunction } from "hardhat-deploy/types"
import { ethers } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import verify from "../utils/verify"
import { MockERC20, MockERC20__factory } from "../typechain"
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService"

const deployMarketplace: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments, network } = hre
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    let args: any[]
    if (developmentChains.includes(network.name)) {
        const USDC = await ethers.getContract("USDC").catch(() => ethers.getContract("MockERC20"))
        const NFT = await ethers.getContract("AminoChainDonation")
        const LINK = await ethers
            .getContract("LinkToken")
            .catch(() => ethers.getContract("MockLinkToken"))
        const ORACLE = await ethers
            .getContract("MockOracle")
            .catch(() => ethers.getContract("MockOracle"))

        const erc20Address = USDC.address
        const nftAddress = NFT.address
        const linkAddress = LINK.address
        const oracleAddress = ORACLE.address

        args = [8, erc20Address, nftAddress, linkAddress, oracleAddress]
    } else {
        args = [
            8,
            "0x3F7a078C98EB0d0E58EEaC1a2C94183300B345ac", // USDC
            "0xE6C8610d8C6638fa7088186f29dceC474f1518C2", // NFT
            "0x326C977E6efc84E512bB9C30f76E30c160eD06FB", //LINK on mumbai
            "0x40193c8518BB267228Fc409a613bDbD8eC5a97b3", //Chainlink Oracle on mumbai
        ]
    }

    const marketplace = await deploy("AminoChainMarketplace", {
        from: deployer,
        gasPrice: "2000000011",
        gasLimit: "19000000",
        args: args,
        log: true,
    })

    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        console.log("Verifing on Etherscan...")
        await delay(20000)
        await verify(
            marketplace.address,
            "contracts/AminoChainMarketplace.sol:AminoChainMarketplace",
            args
        ) /*.catch( () => {})*/
    }
}

export default deployMarketplace
deployMarketplace.tags = [`all`, `marketplace`]
