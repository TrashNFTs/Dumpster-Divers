// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../contracts/DumpsterDivers.sol";
import "../contracts/Trash.sol";
import "../contracts/DumpsterBin.sol";

// import "../contracts/YourContract.sol";

contract YourContractTest is Test {
    // YourContract public yourContract;
    Trash trash;
    DumpsterDivers dumpsterDivers;
    DumpsterBin dumpsterBin;

    address trashOwner;
    address dumpsterBinOwner;

    address user;

    function setUp() public {
        trashOwner = vm.addr(1);
        dumpsterBinOwner = vm.addr(2);
        user = vm.addr(3);

        trash = new Trash(trashOwner);

        dumpsterBin = new DumpsterBin(dumpsterBinOwner);

        dumpsterDivers = new DumpsterDivers(address(dumpsterBin));

        vm.startPrank(dumpsterBinOwner);
        dumpsterBin.setDumpsterDivers(address(dumpsterDivers));
        dumpsterBin.setTrash(address(trash));
        vm.stopPrank();
    }

    function testMessageOnDeployment() public {
        vm.prank(trashOwner);
        trash.setWhitelist(trashOwner, true);

        assertEq(trash.balanceOf(trashOwner), 10000 * 10 ** 18);

        vm.prank(trashOwner);
        trash.transfer(user, 10 ** 18);

        assertEq(trash.balanceOf(trashOwner), 9999 * 10 ** 18);
        assertEq(trash.ownerOf(1), user);

        vm.startPrank(user);
        trash.setApprovalForAll(address(dumpsterBin), true);
        dumpsterBin.mint(1);
        vm.stopPrank();

        assertEq(trash.ownerOf(1), address(dumpsterBin));
        assertEq(dumpsterDivers.ownerOf(0), user);
    }

    function testRevert__CannotMintAsUser() public {
        vm.prank(user);
        vm.expectRevert(DumpsterDivers.DUMPSTER_DIVERS__NOT_VAULT.selector);
        dumpsterDivers.mint(user);
    }

    function testRevert__SetDumpsterDivers() public {
        vm.prank(user);
        vm.expectRevert(DumpsterBin.DUMPSTER_BIN__NOT_OWNER.selector);
        dumpsterBin.setDumpsterDivers(address(dumpsterDivers));
    }

    function testRevert__SetTrash() public {
        vm.prank(user);
        vm.expectRevert(DumpsterBin.DUMPSTER_BIN__NOT_OWNER.selector);
        dumpsterBin.setTrash(address(trash));
    }
}
