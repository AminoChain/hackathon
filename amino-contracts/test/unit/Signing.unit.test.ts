import {expect} from "chai";
import {ethers} from "hardhat";
import {arrayify, hashMessage, recoverAddress} from "ethers/lib/utils";

describe("Sign & recover test", async () => {
    it("Sign & recover", async () => {
        const [wallet] = await ethers.getSigners()

        const message = 'Test message'
        const signature = await wallet.signMessage(message)
        const digest = arrayify(hashMessage(message))
        const recoveredAddress = recoverAddress(digest, signature)

        expect(recoveredAddress).eq(wallet.address)
    })
})