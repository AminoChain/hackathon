import {AES, ModeOfOperation, padding, utils} from "aes-js";
import {expect} from "chai";

const key = "Example128BitKey"
const keyBytes = utils.utf8.toBytes(key)

// based on https://gist.github.com/TimWei/2768e247e9e334114e46e3f88542e539

describe("Encryption Tests", async () => {
    it("16Byte", async () => {
        // The initialization vector, which must be 16 bytes
        const iv = utils.utf8.toBytes("IVMustBe16Bytes.")

        const data = "TextMustBe16Byte"
        const dataInBytes = utils.utf8.toBytes(data)

        const aesCbc1 = new ModeOfOperation.cbc(keyBytes, iv)
        const encryptedBytes = aesCbc1.encrypt(dataInBytes)

        //////////////////////////////////////////////


        // The cipher-block chaining mode of operation maintains internal
        // state, so to decrypt a new instance must be instantiated.
        const aesCbc2 = new ModeOfOperation.cbc(keyBytes, iv)
        const decryptedBytes = aesCbc2.decrypt(encryptedBytes);
        const decryptedText = utils.utf8.fromBytes(decryptedBytes);

        expect(decryptedText).eq(data)
    })

    it("Any size data", async () => {
        // The initialization vector, which must be 16 bytes
        const iv = utils.utf8.toBytes("IVMustBe16Bytes.")

        const data = "TextMustBe16Byte+"
        const dataInBytes = utils.utf8.toBytes(data)
        const dataInPaddedBytes = padding.pkcs7.pad(dataInBytes)

        const aesCbc1 = new ModeOfOperation.cbc(keyBytes, iv)
        const encryptedBytes = aesCbc1.encrypt(dataInPaddedBytes)

        //////////////////////////////////////////////


        // The cipher-block chaining mode of operation maintains internal
        // state, so to decrypt a new instance must be instantiated.
        const aesCbc2 = new ModeOfOperation.cbc(keyBytes, iv)
        const decryptedBytes = aesCbc2.decrypt(encryptedBytes);
        const decryptedStripedBytes = padding.pkcs7.strip(decryptedBytes)
        const decryptedText = utils.utf8.fromBytes(decryptedStripedBytes)
        expect(decryptedText).eq(data)
    })
})