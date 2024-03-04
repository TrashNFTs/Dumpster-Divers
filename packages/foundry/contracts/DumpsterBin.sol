//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {DumpsterDivers} from "./DumpsterDivers.sol";
import {Trash} from "./Trash.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DumpsterBin is Ownable {
    error DUMPSTER_BIN__DID_NOT_PROVIDE_WEE_FEE();
    error DUMPSTER_BIN__UHOH();
    error DUMPSTER_BIN__UHOH2();

    Trash s_trash;
    DumpsterDivers s_dumpsterDivers;

    uint256 weeFee;

    constructor(
        address newOwner,
        address trash,
        address dumpsterDivers
    ) Ownable(newOwner) {
        s_trash = Trash(trash);
        s_dumpsterDivers = DumpsterDivers(dumpsterDivers);
        weeFee = 0.00042069 ether;
    }

    function mintBatch(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            mint(tokenIds[i]);
        }
    }

    function mint(uint256 tokenId) public {
        if (tokenId > s_trash.minted()) revert DUMPSTER_BIN__UHOH2();
        if (s_trash.ownerOf(tokenId) != msg.sender) revert DUMPSTER_BIN__UHOH();

        s_trash.transferFrom(msg.sender, address(this), tokenId);
        s_dumpsterDivers.mint(msg.sender, tokenId);
    }

    function burn(uint256 tokenId) public payable {
        if (msg.value < getWeeFee()) {
            revert DUMPSTER_BIN__DID_NOT_PROVIDE_WEE_FEE();
        }

        s_dumpsterDivers.burn(tokenId);

        uint256 originalId = s_dumpsterDivers.originalTokenIds(tokenId);

        s_trash.transferFrom(address(this), msg.sender, originalId);
    }

    function burnBatch(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            burn(tokenIds[i]);
        }
    }

    function getWeeFee() public view returns (uint256) {
        return weeFee;
    }

    function setWeeFee(uint256 value) external onlyOwner {
        weeFee = value;
    }

    function withdrawWeeFees(address recipient) external payable onlyOwner {
        (bool sent, ) = recipient.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
