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

    function testMintBatch(uint256 numOfNfts) public {
        uint256 maxNfts = 10000;
        vm.assume(numOfNfts > 0);
        vm.assume(numOfNfts <= maxNfts);

        console.log(numOfNfts);
        vm.prank(deployer);
        trash.setWhitelist(deployer, true);

        assertEq(trash.balanceOf(deployer), maxNfts * 10 ** 18);

        string[] memory originalOwnerTokenURIs = new string[](numOfNfts);

        for (uint256 i = 1; i <= numOfNfts; i++) {
            originalOwnerTokenURIs[i - 1] = trash.tokenURI(i);
        }

        vm.prank(deployer);
        trash.transfer(user, numOfNfts * 10 ** 18);

        assertEq(trash.balanceOf(deployer), (maxNfts - numOfNfts) * 10 ** 18);

        string[] memory originalTokenURIs = new string[](numOfNfts);

        for (uint256 i = 1; i <= numOfNfts; i++) {
            assertEq(trash.ownerOf(i), user);
            originalTokenURIs[i - 1] = trash.tokenURI(i);
            assertEq(originalTokenURIs[i - 1], originalOwnerTokenURIs[i - 1]);
        }

        vm.startPrank(user);
        trash.setApprovalForAll(address(dumpsterBin), true);

        uint256[] memory ids = new uint256[](numOfNfts);
        for (uint256 i = 0; i < numOfNfts; i++) {
            ids[i] = i + 1;
        }

        dumpsterBin.mintBatch(ids);

        for (uint256 i = 0; i < numOfNfts; i++) {
            assertEq(trash.ownerOf(i + 1), address(dumpsterBin));
            assertEq(dumpsterDivers.ownerOf(i), user);
        }

        uint256[] memory ids2 = new uint256[](numOfNfts);
        for (uint256 i = 0; i < numOfNfts; i++) {
            ids2[i] = i;
        }

        dumpsterBin.burnBatch(ids2);

        vm.stopPrank();

        for (uint256 i = 1; i <= numOfNfts; i++) {
            assertEq(trash.ownerOf(i), user);
            vm.expectRevert();
            dumpsterDivers.ownerOf(i - 1);
        }
    }

    function testRevert__CannotMintIfNotOwnerOfBin(address addr) public {
        vm.assume(addr != address(dumpsterBin));
        vm.prank(user);
        vm.expectRevert();
        dumpsterDivers.mint(user, 0);
    }
}
