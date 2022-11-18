// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "../libraries/AminoChainLibrary.sol";

interface IAminoChainAuthenticator {
    function register(AminoChainLibrary.RegistrationData calldata data) external;

    /** @notice Check if donor already made donation
     */
    function isRegistered(address donor) external view returns (bool);
}
