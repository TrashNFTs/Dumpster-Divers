//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ERC404.sol";
import "./Strings.sol";

contract Trash is ERC404 {
    string public dataURI;
    string public baseTokenURI;

    constructor(
        address _owner
    ) ERC404("Dumpster Divers", "TRASH", 18, 10000, _owner) {
        balanceOf[_owner] = 10000 * 10 ** 18;
    }

    function setDataURI(string memory _dataURI) public onlyOwner {
        dataURI = _dataURI;
    }

    function setTokenURI(string memory _tokenURI) public onlyOwner {
        baseTokenURI = _tokenURI;
    }

    function setNameSymbol(
        string memory _name,
        string memory _symbol
    ) public onlyOwner {
        _setNameSymbol(_name, _symbol);
    }

    function mint() external {
        _mint(msg.sender);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        if (bytes(baseTokenURI).length > 0) {
            return string.concat(baseTokenURI, Strings.toString(id));
        } else {
            uint8 seed = uint8(bytes1(keccak256(abi.encodePacked(id))));
            string memory image;
            string memory color;

            if (seed <= 100) {
                image = "GREY.PNG";
                color = "Grey";
            } else if (seed <= 160) {
                image = "BLUE.PNG";
                color = "Blue";
            } else if (seed <= 210) {
                image = "GREEN.PNG";
                color = "Green";
            } else if (seed <= 240) {
                image = "YELLOW.PNG";
                color = "Yellow";
            } else if (seed <= 255) {
                image = "PINK.PNG";
                color = "Pink";
            }

            string memory jsonPreImage = string.concat(
                string.concat(
                    string.concat(
                        '{"name": "Dumpster Divers #',
                        Strings.toString(id)
                    ),
                    '","description":"A collection of 10,000 trashy Dumpster Divers enabled by ERC404, an experimental token standard pioneered by Pandora.","external_url":"https://trashnfts.com","image":"'
                ),
                string.concat(dataURI, image)
            );
            string memory jsonPostImage = string.concat(
                '","attributes":[{"trait_type":"Color","value":"',
                color
            );
            string memory jsonPostTraits = '"}]}';

            return
                string.concat(
                    "data:application/json;utf8,",
                    string.concat(
                        string.concat(jsonPreImage, jsonPostImage),
                        jsonPostTraits
                    )
                );
        }
    }
}
