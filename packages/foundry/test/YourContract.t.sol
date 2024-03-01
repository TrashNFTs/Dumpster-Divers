// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/DumpsterDivers.sol";
import {Trash} from "../contracts/Trash.sol";
import "../contracts/DumpsterBin.sol";

contract YourContractTest is Test {
    Trash trash;
    DumpsterDivers dumpsterDivers;
    DumpsterBin dumpsterBin;

    address deployer;
    address user;

    function setUp() public {
        deployer = vm.addr(1);
        user = vm.addr(2);

        vm.startPrank(deployer);
        trash = new Trash(deployer);
        dumpsterDivers = new DumpsterDivers(deployer);
        dumpsterBin = new DumpsterBin(
            deployer,
            address(trash),
            address(dumpsterDivers)
        );

        dumpsterDivers.transferOwnership(address(dumpsterBin));
        vm.stopPrank();
    }

    function generateRandomNumber(
        uint256 rarityOffset,
        uint256 seed
    ) public view returns (uint256) {
        // uint256 offset = 0;
        // for (uint256 i = 0; i <= rarityOffset; i++) {
        //     offset += 20000;
        // }

        uint256 blockNumber = block.number - rarityOffset; // Use the previous block's hash
        bytes32 blockHash = blockhash(blockNumber);
        return (uint256(blockHash) % seed) + (rarityOffset * 10000);
    }

    function testMe(uint256 bn) external {
        vm.assume(bn > 1000000);

        vm.warp(1641070800);
        vm.roll(bn);

        for (uint256 i = 0; i < 10000; i++) {
            uint256 rn = generateRandomNumber(0, 10000);
            assertEq(rn < 10000, true);
        }
    }

    function testMe2(uint256 bn) external {
        vm.assume(bn > 1000000);

        vm.warp(1641070800);
        vm.roll(bn);

        for (uint256 i = 0; i < 10000; i++) {
            uint256 rn = generateRandomNumber(1, 10000);
            assertEq(rn >= 10000 && rn < 20000, true);
        }
    }

    function testMe3(uint256 bn) external {
        vm.assume(bn > 1000000);

        vm.warp(1641070800);
        vm.roll(bn);

        for (uint256 i = 0; i < 10000; i++) {
            uint256 rn = generateRandomNumber(2, 10000);
            assertEq(rn >= 20000 && rn < 30000, true);
        }
    }

    function testMe4(uint256 bn) external {
        vm.assume(bn > 1000000);

        vm.warp(1641070800);
        vm.roll(bn);

        for (uint256 i = 0; i < 10000; i++) {
            uint256 rn = generateRandomNumber(3, 10000);
            assertEq(rn >= 30000 && rn < 40000, true);
        }
    }

    function testMe5(uint256 bn) external {
        vm.assume(bn > 1000000);

        vm.warp(1641070800);
        vm.roll(bn);

        for (uint256 i = 0; i < 10000; i++) {
            uint256 rn = generateRandomNumber(4, 10000);
            assertEq(rn >= 40000 && rn < 50000, true);
        }
    }

    // function testStrict() external {
    //     vm.warp(1641070800);
    //     vm.roll(50000);

    //     uint256 rn = generateRandomNumber(1, 20000);
    //     console.log(rn);
    //     // assertEq(rn > 20000 && rn <= 40001, true);
    // }

    // function testMintBatch(uint256 numOfNfts) public {
    //     uint256 maxNfts = 10000;
    //     vm.assume(numOfNfts > 0);
    //     vm.assume(numOfNfts <= maxNfts);

    //     console.log(numOfNfts);
    //     vm.prank(deployer);
    //     trash.setWhitelist(deployer, true);

    //     assertEq(trash.balanceOf(deployer), maxNfts * 10 ** 18);

    //     string[] memory originalOwnerTokenURIs = new string[](numOfNfts);

    //     for (uint256 i = 1; i <= numOfNfts; i++) {
    //         originalOwnerTokenURIs[i - 1] = trash.tokenURI(i);
    //     }

    //     vm.prank(deployer);
    //     trash.transfer(user, numOfNfts * 10 ** 18);

    //     assertEq(trash.balanceOf(deployer), (maxNfts - numOfNfts) * 10 ** 18);

    //     string[] memory originalTokenURIs = new string[](numOfNfts);

    //     for (uint256 i = 1; i <= numOfNfts; i++) {
    //         assertEq(trash.ownerOf(i), user);
    //         originalTokenURIs[i - 1] = trash.tokenURI(i);
    //         assertEq(originalTokenURIs[i - 1], originalOwnerTokenURIs[i - 1]);
    //     }

    //     vm.startPrank(user);
    //     trash.setApprovalForAll(address(dumpsterBin), true);

    //     uint256[] memory ids = new uint256[](numOfNfts);
    //     for (uint256 i = 0; i < numOfNfts; i++) {
    //         ids[i] = i + 1;
    //     }

    //     dumpsterBin.mintBatch(ids);

    //     for (uint256 i = 0; i < numOfNfts; i++) {
    //         assertEq(trash.ownerOf(i + 1), address(dumpsterBin));
    //         assertEq(dumpsterDivers.ownerOf(i), user);
    //     }

    //     uint256[] memory ids2 = new uint256[](numOfNfts);
    //     for (uint256 i = 0; i < numOfNfts; i++) {
    //         ids2[i] = i;
    //     }

    //     dumpsterBin.burnBatch(ids2);

    //     vm.stopPrank();

    //     for (uint256 i = 1; i <= numOfNfts; i++) {
    //         assertEq(trash.ownerOf(i), user);
    //         vm.expectRevert();
    //         dumpsterDivers.ownerOf(i - 1);
    //     }
    // }

    // function testRevert__CannotMintIfNotOwnerOfBin(address addr) public {
    //     vm.assume(addr != address(dumpsterBin));
    //     vm.prank(user);
    //     vm.expectRevert();
    //     dumpsterDivers.mint(user, 0);
    // }
}
