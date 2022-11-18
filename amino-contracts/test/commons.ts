import chai from "chai";
import {BigNumber, BigNumberish, BytesLike} from "ethers";
import {ethers} from "hardhat";
import {arrayify} from "ethers/lib/utils";
import {PromiseOrValue} from "../typechain/common";

export interface HLA {
    A: number[]
    B: number[]
    C: number[]
    DPB: number[]
    DRB: number[]
}

export interface HLAHashed {
    A: string
    B: string
    C: string
    DPB: string
    DRB: string
}

export const hla: HLA = {
    A: [1, 2, 3],
    B: [1, 2, 3],
    C: [1, 2, 3],
    DPB: [1, 2, 3, 4],
    DRB: [1, 2, 3, 4],
}

export type RegistrationData = {
    hlaHashed: HLAHashed;
    hlaHash: PromiseOrValue<BytesLike>;
    hlaEncoded: PromiseOrValue<BytesLike>;
    genomeEncodedIpfsId: PromiseOrValue<string>;
    amounts: PromiseOrValue<BigNumberish>[];
    donor: PromiseOrValue<string>;
    signature: PromiseOrValue<BytesLike>;
    biobank: PromiseOrValue<string>;
};

/* bioDataHash = await authenticator.getBioDataHash(
    bioData.A.toString(),
    bioData.B.toString(),
    bioData.C.toString(),
    bioData.DPB.toString(),
    bioData.DRB.toString()
)*/
export const hlaHash = '0x1d6b4481e160c4328f25e4e540261b41dcc9ef6ae904f6220e8a0eafaab6ddc6'

/*
messageHash = await authenticator.getRegistrationHash(
            donor.address,
            biodataHash
        )
 */
export const messageHash = '0x84338cc7dcebbbbc8e2df4105f451df8da42e2b854fb44ab48b3943b5156b41d'

// signature = await donor.signMessage(arrayify(messageHash))
export const signature = '0x5577543102ecf5dc9696e90511bf863aa86b67db8cdedf1c473dc2f283add16d454f01a2a586597662895a62fd8f1c0b8bd88481327f713de20889d666fea3be1c'

export const hlaHashed: HLAHashed = {
    A: "0x0000000000000000000000000000000000000000000000000000000000000001",
    B: "0x0000000000000000000000000000000000000000000000000000000000000001",
    C: "0x0000000000000000000000000000000000000000000000000000000000000001",
    DPB: "0x0000000000000000000000000000000000000000000000000000000000000001",
    DRB: "0x0000000000000000000000000000000000000000000000000000000000000001",
}

export const mockHlaEncoded = ethers.constants.HashZero

// export const biobankAddress = "0x985AC3C3Dbb4135Bea36D643bf93d073A10520bc"
export const amounts = [6, 3, 4, 1, 2]
export const firstNftTokeId = 1
export const DEFAULT_PRICE_PER_CC = 1400

const delay = (s: number) => new Promise(res => setTimeout(res, s*1000));

export const LAGEST_UINT = BigNumber.from(
    // This is uint256's max value (2^256 - 1) in hex
    // Fun Fact: There are 64 f's in here.
    // In hexadecimal, each digit can represent 4 bits
    // f is the largest digit in hexadecimal (1111 in binary)
    // 4 + 4 = 8 i.e. two hex digits = 1 byte
    // 64 digits = 32 bytes
    // 32 bytes = 256 bits = uint256
    "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
)

export function web3StringToBytes32(text: string) {
    const utils = ethers.utils
    let result = utils.hexlify(utils.toUtf8Bytes(text));
    while (result.length < 66) { result += '0'; }
    if (result.length !== 66) {
        throw new Error(`invalid web3 implicit bytes32: ${result} for text: ${text}`);
    }
    return result;
}


chai.use(function (chai, util) {
    chai.Assertion.addMethod("bioDataEqual", function (expected: HLA) {
        let actual = this._obj as HLA
        new chai.Assertion(actual.A).eql(expected.A)
        new chai.Assertion(actual.B).eql(expected.B)
        new chai.Assertion(actual.C).eql(expected.C)
        new chai.Assertion(actual.DPB).eql(expected.DPB)
        new chai.Assertion(actual.DRB).eql(expected.DRB)
    })

    chai.Assertion.addMethod("correctHash", function () {
        let actual = this._obj as string
        new chai.Assertion(actual.startsWith('0x')).true
        new chai.Assertion(actual).length(66)
    })
})

declare module Chai {
    interface Assertion {
        bioDataEqual(bioData: any): Assertion
        correctHash(): Assertion
    }
}
