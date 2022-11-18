import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains } from "../helper-hardhat-config"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { BigNumber } from "ethers"

const deployFunction: DeployFunction = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name)) {
        log(`Local network detected! Deploying mocks...`)

        // const USDC = await ethers.getContract("USDC")

        const erc20 = await deploy("MockERC20", {
            contract: `MockERC20`,
            from: deployer,
            log: true,
            args: [],
        })

        /*const nft = await deploy(`MockNFT`, {
            contract: `MockNFT`,
            from: deployer,
            log: true,
            args: ["AMINO", "AMINO"],
        })*/

        /*const donorIncentiveRate = 8
        const marketplace = await deploy(`MockAminoChainMarketplace`, {
            contract: `MockAminoChainMarketplace`,
            from: deployer,
            log: true,
            args: [donorIncentiveRate, USDC.address, nft.address],
        })*/

        /*const authenticator = await deploy(`AminoChainAuthenticator`, {
            contract: `AminoChainAuthenticator`,
            from: deployer,
            log: true,
            args: [nft.address, marketplace.address, USDC.address],
        })*/

        log(`Mocks Deployed!`)
        log(`----------------------------------------------------`)
        log(`You are deploying to a local network, you'll need a local network running to interact`)
        log("Please run `yarn hardhat console` to interact with the deployed smart contracts!")
        log(`----------------------------------------------------`)
    }
}

export default deployFunction
deployFunction.tags = [`all`, `mocks`, `main`]
