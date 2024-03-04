//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "../contracts/YourContract.sol";
import "./DeployHelpers.s.sol";
import "../contracts/Trash.sol";

import {DumpsterDivers, Trash, DumpsterBin} from "../contracts/DumpsterBin.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    Trash trash;
    DumpsterDivers dumpsterDivers;
    DumpsterBin dumpsterBin;

    address trashDaoAddress = 0x6191Ffa327e115A4F6cA09a6CF5De05A6f8DeE96;

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        address deployerPubKey = vm.createWallet(deployerPrivateKey).addr;

        vm.startBroadcast(deployerPrivateKey);

        // trash = new Trash(deployerPubKey);
        // trash.setWhitelist(deployerPubKey, true);
        // trash.setDataURI(
        //     "ipfs://bafybeiclqcx3kdoauwelxgcny25wauci6qqonfigid6y2wrv4ep4gji3gq/"
        // );

        dumpsterDivers = new DumpsterDivers(deployerPubKey);
        dumpsterBin = new DumpsterBin(
            trashDaoAddress,
            0xdf00fde26a6819507649904ca52fe5062ef75ba7,
            address(dumpsterDivers)
        );

        dumpsterDivers.transferOwnership(address(dumpsterBin));

        // trash.transfer(
        //     0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf,
        //     20 * 10 ** 18
        // );

        // trash.transfer(
        //     0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf,
        //     20 * 10 ** 18
        // );

        // trash.transfer(
        //     0x51603C7059f369aB04B16AddFB7BB6c4e34b8523,
        //     20 * 10 ** 18
        // );

        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function test() public {}
}
