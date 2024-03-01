//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Strings.sol";

contract DumpsterDivers is Ownable, ERC721 {
    error DUMPSTER_DIVERS__NOT_VAULT();

    uint256 mintCount;

    string s_baseURI_0;
    string s_baseURI_1;
    string s_baseURI_2;
    string s_baseURI_3;
    string s_baseURI_4;

    constructor(
        address newOwner,
        string memory baseImageURI_0,
        string memory baseImageURI_1,
        string memory baseImageURI_2,
        string memory baseImageURI_3,
        string memory baseImageURI_4
    ) ERC721("Dumpster Divers", "DD") Ownable(newOwner) {
        s_baseURI_0 = baseImageURI_0;
        s_baseURI_1 = baseImageURI_1;
        s_baseURI_2 = baseImageURI_2;
        s_baseURI_3 = baseImageURI_3;
        s_baseURI_4 = baseImageURI_4;
    }

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

    function generateRandomNumber(
        uint256 rarityOffset,
        uint256 seed
    ) public view returns (uint256) {
        uint256 blockNumber = block.number - rarityOffset; // Use the previous block's hash
        bytes32 blockHash = blockhash(blockNumber);
        return (uint256(blockHash) % seed) + (rarityOffset * 10000);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        _requireOwned(id);

        uint8 seed = uint8(
            bytes1(keccak256(abi.encodePacked(originalTokenIds[id])))
        );

        uint256 rarityOffset;

        string memory selectedBaseURI;

        string memory name;
        if (seed <= 100) {
            rarityOffset = 0;
            name = "Grey";
            selectedBaseURI = s_baseURI_0;
        } else if (seed <= 160) {
            rarityOffset = 1;
            name = "Blue";
            selectedBaseURI = s_baseURI_1;
        } else if (seed <= 210) {
            rarityOffset = 2;
            name = "Green";
            selectedBaseURI = s_baseURI_2;
        } else if (seed <= 240) {
            rarityOffset = 3;
            name = "Yellow";
            selectedBaseURI = s_baseURI_3;
        } else if (seed <= 255) {
            rarityOffset = 4;
            name = "Pink";
            selectedBaseURI = s_baseURI_4;
        }

        uint256 rn = generateRandomNumber(rarityOffset, 10000);

        return string.concat(selectedBaseURI, Strings.toString(rn));

        // string memory jsonPreImage = string.concat(
        //     string.concat(
        //         string.concat(string.concat('{"name": "', name), ' Reveal"'),
        //         ',"description":"A Test description","external_url":"https://trashnfts.com"'
        //     )
        // );

        // string memory jsonPostImage = string.concat(
        //     string.concat(jsonPreImage, '"image": "'),
        //     string.concat(
        //         s_baseImageURI,
        //         Strings.toString(generateRandomNumber(rarityOffset, 10000))
        //     )
        // );

        // string memory jsonPostTraits = "}";

        // return
        //     string.concat(
        //         "data:application/json;utf8,",
        //         string.concat(jsonPostImage, jsonPostTraits)
        //     );
    }
}
