// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint8 public immutable decimal;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimal_,
        uint256 supply
    ) ERC20(name_, symbol_) {
        decimal = decimal_;
        _mint(msg.sender, supply * 10**decimal_);
    }

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }
}
