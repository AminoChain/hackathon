// SPDX-License-Identifier: GPL-2.0

pragma solidity ^0.8.7;

import "./interfaces/IAminoChainDonation.sol";
import "./AminoChainDonation.sol";
import "./interfaces/IAminoChainMarketplace.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/** @title AminoChain Authenticator
 *  @notice Handles the minting of tokenized stem cells and listing
 *  them on the marketplace. Also responsible for hold and withdraw protocol fees
 */
contract AminoChainAuthenticator is IERC721Receiver, Ownable, Pausable {
    IAminoChainDonation public nft;
    IAminoChainMarketplace public marketplace;
    IERC20 public usdc;

    /** @notice Donation price depends on amount in CC (cubic centimeters)
     */
    uint public defaultPricePerCCinUsd = 1400;

    /** === Events === **/

    /** @notice emitted when new donation registered
     */
    event DonationRegistered(
        address indexed donor,
        address indexed biobank,
        uint256[] indexed tokenIds,
        uint256[] amounts
    );

    /** @notice emitted when protocol fees withdrawal
     */
    event Withdrawn(address indexed to, uint amount);

    /** === Constructor === **/

    constructor(
        address nftAddress,
        address marketplaceAddress,
        address usdcAddress
    ) {
        nft = IAminoChainDonation(nftAddress);
        nft.setApprovalForAll(marketplaceAddress, true);
        marketplace = IAminoChainMarketplace(marketplaceAddress);
        usdc = IERC20(usdcAddress);
    }

    /** === External Functions === **/

    function setNftAddress(address nftAddress) external onlyOwner whenNotPaused {
        nft = IAminoChainDonation(nftAddress);
        nft.setApprovalForAll(address(marketplace), true);
    }

    function setMarketplaceAddress(address marketplaceAddress) external onlyOwner whenNotPaused {
        marketplace = IAminoChainMarketplace(marketplaceAddress);
    }

    function setUsdcAddress(address usdcAddress) external onlyOwner whenNotPaused {
        usdc = IERC20(usdcAddress);
    }

    function setDefaultPricePerCCinUsd(uint newDefaultPricePerCCinUsd) external onlyOwner whenNotPaused {
        defaultPricePerCCinUsd = newDefaultPricePerCCinUsd;
    }

    /** @notice Register a donation. Minting AminoChainDonation NFTs and list tokens on AminoChainMarketplace
     *  @dev Called by `amino-backend` service in `register-donation` endpoint
     *  @param data.hlaHashed AminoChainLibrary.HlaHashed, HLA data with hashes instead actual data
     *  @param data.hlaHash Hash of HLA data as HLA ID
     *  @param data.hlaEncoded Encoded HLA data
     *  @param data.genomeEncodedIpfsId IPFS ID if file of encoded genome data
     *  @param data.amounts The array of donation fraction sizes (in cubic centimeters)
     *  @param data.donor Donor wallet address
     *  @param data.biobank Biobank (the physical holder of the stem cells) wallet address
     */
    function register(AminoChainLibrary.RegistrationData calldata data) external onlyOwner whenNotPaused {
        uint256[] memory tokenIds = nft.mint(data);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            marketplace.listItem(tokenIds[i], data.amounts[i], defaultPricePerCCinUsd, data.donor, data.biobank);
        }

        emit DonationRegistered(data.donor, data.biobank, tokenIds, data.amounts);
    }

    /** @notice Withdraw platform fees
     *  @param to Address of for USDC transferring
     *  @param amount Amount of USDC tokens to transfer
     */
    function withdraw(address to, uint amount) external onlyOwner whenNotPaused {
        require(to != address(0), "Invalid to address");
        require(amount <= usdc.balanceOf(address(this)), "Not enough balance");

        usdc.transfer(to, amount);

        emit Withdrawn(to, amount);
    }

    /** @notice Good to have for migration
     */
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function transferOwnership(address newOwner) public override(Ownable) onlyOwner whenNotPaused {
        Ownable.transferOwnership(newOwner);
    }

    // === View/Pure Functions === //

    function isRegistered(address donor) public view returns (bool) {
        return nft.getTokenIdsByDonor(donor).length != 0;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    )
        external
        pure
        returns (bytes4)
    {
        return IERC721Receiver.onERC721Received.selector;
    }

    /** @notice Compute hash for donor-donation connection process
     *  @param donor Donor address
     *  @param hlaHash HLA ID
     */
    function getRegistrationHash(address donor, bytes32 hlaHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(donor, hlaHash));
    }
}
