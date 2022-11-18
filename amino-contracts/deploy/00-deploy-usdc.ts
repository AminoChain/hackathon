import { DeployFunction } from "hardhat-deploy/types"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import {BigNumber, Contract} from "ethers"
import { ERC20, IERC20Metadata } from "../typechain"
import {developmentChains, testnetChains} from "../helper-hardhat-config";
import {delay} from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";
import verify from "../utils/verify";

const deployFunction: DeployFunction = async () => {
    const { deploy, log } = deployments
    // const { deployer } = await getNamedAccounts()
    const [deployer, donor, buyer] = await ethers.getSigners()
    const chainId: number | undefined = network.config.chainId

    const constructorArgs = [`USDC`, `USDC`, 6, 1000000]
    let usdc: Contract

    // If we are on a local development network, we need to deploy mocks!
    if (developmentChains.includes(network.name) || testnetChains.includes(network.name)) {
        log(`Local network detected! Deploying USDC...`)
        await deploy(`USDC`, {
            contract: `Token`,
            from: deployer.address,
            log: true,
            args: constructorArgs,
        })
        usdc = (await ethers.getContract("USDC")) as IERC20Metadata
        let usdcDecimals = await usdc.decimals()

        if (developmentChains.includes(network.name)) {
            let amount = BigNumber.from(10).pow(usdcDecimals).mul(100_000)
            if (network.name === "mumbai") {
            await usdc.transfer(deployer.address, amount)
        } else {await usdc.transfer(buyer.address, amount)
        }

        if (testnetChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
            console.log("Verifying on polygonscan...")
            await delay(20000)
            await verify(
                usdc.address,
                "contracts/mocks/Token.sol:Token",
                constructorArgs
            ) /*.catch( () => {})*/
        }
    }

}

    if (!developmentChains.includes(network.name) && process.env.POLYGONSCAN_API_KEY) {
        const usdc = (await ethers.getContract("USDC")) as IERC20Metadata
        console.log("Verifing on Etherscan...")
        await delay(20000)
        await verify(usdc.address, "contracts/mocks/Token.sol:Token", [
            `USDC`,
            `USDC`,
            6,
            1000000,
        ]) /*.catch( () => {})*/
    }
}

export default deployFunction
deployFunction.tags = [`all`, `usdc`]
