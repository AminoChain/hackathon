// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

library AminoChainLibrary {
    struct RegistrationData {
        AminoChainLibrary.HlaHashed hlaHashed;
        bytes32 hlaHash;
        bytes hlaEncoded;
        string genomeEncodedIpfsId;
        uint256[] amounts;
        address donor;
        address biobank;
    }

    struct HlaHashed {
        bytes32 A;
        bytes32 B;
        bytes32 C;
        bytes32 DPB;
        bytes32 DRB;
    }
}
