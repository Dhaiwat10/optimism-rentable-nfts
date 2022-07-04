// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC4907.sol";

contract RentableNFT is ERC4907 {
    mapping(uint256 => string) public tokenURIs;

    constructor(string memory _name, string memory _symbol)
        ERC4907(_name, _symbol)
    {}

    function mint(uint256 _tokenId, string memory _tokenURI) public {
        _mint(msg.sender, _tokenId);
        tokenURIs[_tokenId] = _tokenURI;
    }

    function rentOut(
        uint256 _tokenId,
        address _user,
        uint64 _expires
    ) public onlyOwner(_tokenId) {
        setUser(_tokenId, _user, _expires);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        return tokenURIs[_tokenId];
    }

    modifier onlyOwner(uint256 _tokenId) {
        require(
            _isApprovedOrOwner(msg.sender, _tokenId),
            "caller is not owner nor approved"
        );
        _;
    }
}
