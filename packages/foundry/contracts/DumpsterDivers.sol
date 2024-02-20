//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DumpsterDivers is ERC721 {
    error DUMPSTER_DIVERS__NOT_VAULT();

    address vault;
    uint256 mintCount;

    constructor(address newVault) ERC721("Dumpster Divers", "DD") {
        vault = newVault;
    }

    function mint(address recipient) external {
        if (msg.sender != vault) revert DUMPSTER_DIVERS__NOT_VAULT();

        uint256 mintId = mintCount;
        mintCount++;
        _safeMint(recipient, mintId);
    }

    function getVault() external view returns (address) {
        return vault;
    }
}
