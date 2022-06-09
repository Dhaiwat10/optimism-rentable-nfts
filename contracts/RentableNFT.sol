// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC4907.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RentableNFT is ERC4907, Ownable {
    constructor(string memory name, string memory symbol)
        ERC4907(name, symbol)
    {}

    function mint(uint256 tokenId, address to) public {
        _mint(to, tokenId);
    }

    function rentOut(
        uint256 tokenId,
        address user,
        uint64 expires
    ) public payable {
        require(msg.value >= 0.0000001 ether, "min rent fee 0.000001 eth reqd");
        setUser(tokenId, user, expires);
    }
}
