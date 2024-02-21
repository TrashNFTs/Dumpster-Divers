//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Strings.sol";

contract DumpsterDivers is Ownable, ERC721URIStorage {
    error DUMPSTER_DIVERS__NOT_VAULT();

    uint256 mintCount;

    constructor(
        address newOwner
    ) ERC721("Dumpster Divers", "DD") Ownable(newOwner) {}

    mapping(uint256 tokenId => uint256 originalTokenId) public originalTokenIds;

    function mint(
        address recipient,
        uint256 originalTokenId
    ) external onlyOwner {
        uint256 mintId = mintCount;
        mintCount++;
        _safeMint(recipient, mintId);
        originalTokenIds[mintId] = originalTokenId;
    }

    function burn(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

    function getMintCount() external view returns (uint256) {
        return mintCount;
    }

    function tokenExists(
        uint256 tokenId
    ) external view returns (bool doesExist) {
        address owner = _ownerOf(tokenId);
        if (owner == address(0)) {
            doesExist = false;
        } else {
            doesExist = true;
        }
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        uint8 seed = uint8(
            bytes1(keccak256(abi.encodePacked(originalTokenIds[id])))
        );

        string memory name;
        if (seed <= 100) {
            name = "Grey";
        } else if (seed <= 160) {
            name = "Blue";
        } else if (seed <= 210) {
            name = "Green";
        } else if (seed <= 240) {
            name = "Yellow";
        } else if (seed <= 255) {
            name = "Pink";
        }

        string memory jsonPreImage = string.concat(
            string.concat(
                string.concat(string.concat('{"name": "', name), ' Reveal"'),
                ',"description":"A Test description","external_url":"https://trashnfts.com"'
            )
        );
        string memory jsonPostTraits = "}";

        return
            string.concat(
                "data:application/json;utf8,",
                string.concat(jsonPreImage, jsonPostTraits)
            );
    }
}
