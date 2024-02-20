//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DumpsterDivers.sol";
import "./Trash.sol";

contract DumpsterBin {
    error DUMPSTER_BIN__NOT_OWNER();

    address owner;
    Trash trash;
    DumpsterDivers dumpsterDivers;

    constructor(address newOwner) {
        owner = newOwner;
    }

    function setDumpsterDivers(address dd) external {
        if (owner != msg.sender) revert DUMPSTER_BIN__NOT_OWNER();

        dumpsterDivers = DumpsterDivers(dd);
    }

    function setTrash(address t) external {
        if (owner != msg.sender) revert DUMPSTER_BIN__NOT_OWNER();

        trash = Trash(t);
    }

    function mint(uint256 tokenId) external {
        trash.transferFrom(msg.sender, address(this), tokenId);
        dumpsterDivers.mint(msg.sender);
    }
}
