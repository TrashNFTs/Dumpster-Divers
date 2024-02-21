//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// import "../contracts/YourContract.sol";
import "./DeployHelpers.s.sol";
import "../contracts/Trash.sol";

import {Trash} from "../contracts/Trash.sol";

contract DeployScript is ScaffoldETHDeploy {
    error InvalidPrivateKey(string);

    address owner = 0xBd1413d4C670c0e1957C3338Eadd6535CB1c562d; // starts as deployer, set to treasury once deployed

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        address deployerPubKey = vm.createWallet(deployerPrivateKey).addr;

        owner = deployerPubKey;

        vm.startBroadcast(deployerPrivateKey);

        Trash dd = new Trash(deployerPubKey);

        dd.setDataURI(
            "ipfs://bafybeiclqcx3kdoauwelxgcny25wauci6qqonfigid6y2wrv4ep4gji3gq/"
        );

        // dd.setWhitelist(deployerPubKey, true);
        dd.setWhitelist(owner, true);
        dd.transfer(owner, 10000 * 10 ** 18);

        dd.transferOwnership(owner);

        console.logString(
            string.concat(
                "YourContract deployed at: ",
                vm.toString(address(dd))
            )
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
