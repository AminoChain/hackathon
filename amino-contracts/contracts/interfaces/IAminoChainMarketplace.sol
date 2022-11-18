//SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

/** @title The interface for AminoChain Marketplace V0.2.0
 *  @notice The AminoChain Marketplace handles the sale of tokenized stem cells and distributing
 *  incentives to donors
 */
interface IAminoChainMarketplace {
    enum physicalStatus {
        AT_ORIGIN,
        IN_TRANSIT,
        DELIVERED
    }

    event newListing(
        address seller,
        uint256 tokenId,
        uint256 sizeInCC,
        uint256 price,
        address donor,
        address bioBank
    );

    event sale(
        address seller,
        uint256 tokenId,
        uint256 sizeInCC,
        address buyer,
        uint256 salePrice,
        uint256 protocolFee,
        address donor,
        uint256 donorIncentive,
        address bioBank
    );

    event approvalRequest(bytes32 requestId, address requester);

    event listingCanceled(address seller, uint256 tokenId);

    event ownershipTransferred(address oldOwner, address newOwner);

    event stemCellsAddressSet(address stemCells);

    event authenticatorAddressSet(address authenticator);

    event newDonorIncentiveRate(uint256 newIncentiveRate);

    /** @notice Lists a ERC-721 token on the marketplace
     *  @dev Before calling this function, the lister must set isApprovedForAll
     *  to true for the marketplace address
     *  @param tokenId The tokenId of the ERC-721 token being listed
     *  @param sizeInCC The donation size (in cubic centimeters) that is being sold
     *  @param donor The source of the stem cells and the recipent of the
     *  incentive after the ERC-20 has been purchased
     *  @param bioBank The physical holder of the stem cells
     */
    function listItem(
        uint256 tokenId,
        uint256 sizeInCC,
        uint256 price_per_cc,
        address donor,
        address bioBank
    ) external;

    /** @notice Transfers payment to bioBank, fee to authenticator, and incentive to donor
     *  @dev Buyer must have the price amount approved for marketplace address
     *  on the USDC contract.
     *  @param tokenId The tokenId of the desired tokenized stem cells
     */
    function buyItem(uint256 tokenId) external;

    /** @notice Requests a Chainlink Any-Api call to determine if the caller is a registered
     *  doctor or researcher. Which then determines if they are allowed to buy stem cells.
     */
    function requestBuyAccess() external;

    /**
     *
     */
    function updateDeliveryStatus(uint256 tokenId, physicalStatus status) external;

    /** @param tokenId The tokenId of the listing being canceled
     */
    function cancelListing(uint256 tokenId) external;

    /** @param tokenId The tokenId of the listing being updated
     *  @param newPrice The new desired price for the token in USDC
     */
    function updateListing(uint256 tokenId, uint256 newPrice) external;

    /** @notice Updates the owner of the marketplace
     *  @dev Must be called by the marketplace owner
     *  @param newOwner The new owner of the marketplace
     */
    function transferOwnership(address newOwner) external;

    /** @notice Updates the tokenized stem cells address
     *  @dev Must be called by the marketplace owner
     *  @param stemCells The new tokenized stem cells address
     */
    function setTokenizedStemCells(address stemCells) external;

    /** @notice Updates the authenticator contract address
     *  @dev Must be called by the marketplace owner
     *  @param _authenticator The new authenticator contract address
     */
    function setAuthenticatorAddress(address _authenticator) external;

    /** @notice Updates the percantage incentive the donors get from a given sale
     *  @dev Must be called by the marketplace owner
     *  @param newIncentiveRate The new rate which determines incentive percentage
     */
    function setDonorIncentiveRate(uint256 newIncentiveRate) external;

    /**
     *
     */
    //    function withdrawLink() external;
}
