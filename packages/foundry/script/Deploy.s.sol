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

        trash = new Trash(deployerPubKey);
        trash.setWhitelist(deployerPubKey, true);
        trash.setDataURI(
            "ipfs://bafybeiclqcx3kdoauwelxgcny25wauci6qqonfigid6y2wrv4ep4gji3gq/"
        );

        dumpsterDivers = new DumpsterDivers(deployerPubKey);
        dumpsterBin = new DumpsterBin(
            deployerPubKey,
            address(trash),
            address(dumpsterDivers)
        );

        dumpsterDivers.transferOwnership(address(dumpsterBin));

        // trash.transfer(
        //     0x62286D694F89a1B12c0214bfcD567bb6c2951491,
        //     10 * 10 ** 18
        // );

        trash.transfer(
            0x1BA8ba8596c676f0bEAC8618Daeb791c253Dd210,
            10 * 10 ** 18
        );
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
