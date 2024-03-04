//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./Strings.sol";

contract DumpsterDivers is Ownable, ERC721URIStorage {
    error DUMPSTER_DIVERS__NOT_VAULT();

    uint256 mintCount;

    string s_baseURI_0 =
        "ipfs://bafybeie7hcmtj7w7y6yoakzc7ha4dcke6lght3l74ogw626gosf6644tpq/";
    string s_baseURI_1 =
        "ipfs://bafybeibuncustskrzstr6h3x6qtekbpbk5kn5zrqo4atp5p75s7j7kokpa/";
    string s_baseURI_2 =
        "ipfs://bafybeidwpiqaoptslgk67chhi5hqzjh4qvitta7dumrhgfa52qd3ueogvm/";
    string s_baseURI_3 =
        "ipfs://bafybeian7copyxccylygtuymnifkupjgznd24z2hlrtdf3b2xhugnktdte/";
    string s_baseURI_4 =
        "ipfs://bafybeia7ejoqm2kf6qleowv2vsjje3dxxfjwcin33vspjyo4ghpzhauryy/";

    constructor(
        address newOwner
    ) ERC721("Dumpster Divers PFP", "DD") Ownable(newOwner) {}

    mapping(uint256 tokenId => uint256 originalTokenId) public originalTokenIds;

    function mint(
        address recipient,
        uint256 originalTokenId
    ) external onlyOwner {
        uint256 mintId = mintCount;
        mintCount++;
        _safeMint(recipient, mintId);
        originalTokenIds[mintId] = originalTokenId;

        uint8 seed = uint8(
            bytes1(keccak256(abi.encodePacked(originalTokenIds[mintId])))
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

        _setTokenURI(
            mintId,
            string.concat(selectedBaseURI, Strings.toString(rn))
        );
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
        uint256 blockNumber = block.number - rarityOffset - 1; // Use the previous block's hash
        bytes32 blockHash = blockhash(blockNumber);
        return (uint256(blockHash) % seed);
    }

    // function tokenURI(uint256 id) public view override returns (string memory) {
    //     _requireOwned(id);

    //     uint8 seed = uint8(
    //         bytes1(keccak256(abi.encodePacked(originalTokenIds[id])))
    //     );

    //     uint256 rarityOffset;

    //     string memory selectedBaseURI;

    //     string memory name;
    //     if (seed <= 100) {
    //         rarityOffset = 0;
    //         name = "Grey";
    //         selectedBaseURI = s_baseURI_0;
    //     } else if (seed <= 160) {
    //         rarityOffset = 1;
    //         name = "Blue";
    //         selectedBaseURI = s_baseURI_1;
    //     } else if (seed <= 210) {
    //         rarityOffset = 2;
    //         name = "Green";
    //         selectedBaseURI = s_baseURI_2;
    //     } else if (seed <= 240) {
    //         rarityOffset = 3;
    //         name = "Yellow";
    //         selectedBaseURI = s_baseURI_3;
    //     } else if (seed <= 255) {
    //         rarityOffset = 4;
    //         name = "Pink";
    //         selectedBaseURI = s_baseURI_4;
    //     }

    //     uint256 rn = generateRandomNumber(rarityOffset, 10000);

    //     return string.concat(selectedBaseURI, Strings.toString(rn));
    // }
}
