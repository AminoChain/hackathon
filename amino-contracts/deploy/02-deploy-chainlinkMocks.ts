import { DeployFunction } from "hardhat-deploy/types"
import { developmentChains } from "../helper-hardhat-config"
import { getNamedAccounts, deployments, network, ethers } from "hardhat"
import { BigNumber } from "ethers"

const deployFunction: DeployFunction = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId: number | undefined = network.config.chainId

    if (developmentChains.includes(network.name)) {
        const link = await deploy("LinkToken", {
            contract: "LinkToken",
            from: deployer,
            log: true,
            args: [],
        })

        const oracle = await deploy("MockOracle", {
            contract: `MockOracle`,
            from: deployer,
            log: true,
            args: [link.address],
        })
    }
}

export default deployFunction
deployFunction.tags = [`all`, `chainlink`]
