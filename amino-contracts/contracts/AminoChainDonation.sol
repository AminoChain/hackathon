// SPDX-License-Identifier: GPL-2.0

pragma solidity ^0.8.4;

import "./libraries/AminoChainLibrary.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./libraries/AminoChainLibrary.sol";

/** @title AminoChain Donation
 *  @notice Tokenizes donated stem cells
 */
contract AminoChainDonation is ERC721, Pausable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => string) private _tokenURIs;

    // Struct encapsulating BioData might be useful in case that we plan
    // to store additional data in the NFT
    struct DonationData {
        address donorAddress;
        AminoChainLibrary.HlaHashed hlaHashed;
        bytes32 hlaHash;
        string genomeEncodedIpfsId;
        uint256 amount;
    }

    // Might also make sense to just use an array since tokenIds are sequencially
    // assigned with the minted NFTs
    //DonationData[] donations;
    mapping(uint256 => DonationData) public tokenIdToDonationData;
    mapping(bytes32 => bytes) public hlaHashToHlaEncoded;
    mapping(address => uint256[]) public addressToTokenIds;

    event NFTMinted(
        address donor,
        AminoChainLibrary.HlaHashed hlaHashed,
        uint256[] tokenIds,
        uint256[] amounts
    );

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenIdCounter.increment();
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(AminoChainLibrary.RegistrationData calldata data)
        public
        onlyOwner
        whenNotPaused
        returns (uint256[] memory)
    {
        // It would have been also possible ot return the ids stored in addressToTokenIds[donor],
        // new array is created here to account for the case that donor might give donation
        // not for the first time.
        uint256[] memory tokenIds = new uint256[](data.amounts.length);
        for (uint256 i = 0; i < data.amounts.length; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            _safeMint(msg.sender, tokenId);
            tokenIdToDonationData[tokenId] = DonationData(
                data.donor,
                data.hlaHashed,
                data.hlaHash,
                data.genomeEncodedIpfsId,
                data.amounts[i]
            );
            hlaHashToHlaEncoded[data.hlaHash] = data.hlaEncoded;
            addressToTokenIds[data.donor].push(tokenId);
            tokenIds[i] = tokenId;
        }
        emit NFTMinted(data.donor, data.hlaHashed, tokenIds, data.amounts);
        return tokenIds;
    }

    function getTokenIdsByDonor(address donor) external view returns (uint256[] memory) {
        return addressToTokenIds[donor];
    }

    function getHlaHashed(uint256 tokenId)
        public
        view
        returns (AminoChainLibrary.HlaHashed memory)
    {
        return tokenIdToDonationData[tokenId].hlaHashed;
    }

    function getHlaEncoded(uint256 tokenId) public view returns (bytes memory) {
        return hlaHashToHlaEncoded[tokenIdToDonationData[tokenId].hlaHash];
    }

    function getGenomeEncodedIpfsId(uint256 tokenId) public view returns (string memory) {
        return tokenIdToDonationData[tokenId].genomeEncodedIpfsId;
    }

    function transferOwnership(address newOwner) public override(Ownable) onlyOwner {
        Ownable.transferOwnership(newOwner);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function setTokenURI(uint256 tokenId, string calldata uri) public {
        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721) returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
