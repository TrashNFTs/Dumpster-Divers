//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {DumpsterDivers} from "./DumpsterDivers.sol";
import {Trash} from "./Trash.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DumpsterBin is Ownable {
    error DUMPSTER_BIN__NOT_OWNER();

    Trash s_trash;
    DumpsterDivers s_dumpsterDivers;

    constructor(
        address newOwner,
        address trash,
        address dumpsterDivers
    ) Ownable(newOwner) {
        s_trash = Trash(trash);
        s_dumpsterDivers = DumpsterDivers(dumpsterDivers);
    }

    function mintBatch(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            mint(tokenIds[i]);
        }
    }

    function mint(uint256 tokenId) public {
        s_trash.transferFrom(msg.sender, address(this), tokenId);
        s_dumpsterDivers.mint(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) public {
        s_dumpsterDivers.burn(tokenId);

        uint256 originalId = s_dumpsterDivers.originalTokenIds(tokenId);

        s_trash.transferFrom(address(this), msg.sender, originalId);
    }

    function burnBatch(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            burn(tokenIds[i]);
        }
    }
}
