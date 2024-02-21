'use client';
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { NftCard } from "./NftCard";
import { Nft } from "~~/components/types";

import { useOwnerOfsDumpsterDivers, useOwnerOfsTrash } from "../../../components/hooks";
import { useJsons } from "../../../components/hooks";

export function SwapComp()  {
    const account = useAccount();
    // const [ownerOfs, setOwnerOfs] = useState<number[]>([]);
    const {data: trashContract} = useScaffoldContract({contractName: "Trash"});
    const {data: vaultContract} = useScaffoldContract({contractName: "DumpsterBin"});
    const {data: dumpsterDiverContract} = useScaffoldContract({contractName: "DumpsterDivers"});

    const { writeAsync: faucet} = useScaffoldContractWrite({contractName: "Trash", functionName: "mint"});

    const { writeAsync } = useScaffoldContractWrite({contractName: "DumpsterBin", functionName: "mint", args: [BigInt(0)]});

    const { data: minted } = useScaffoldContractRead({ contractName: "Trash", functionName: "minted"});
    const { data: mintCount } = useScaffoldContractRead({ contractName: "DumpsterDivers", functionName: "getMintCount"});
    const { ownerOfs, getOwnerOfs } = useOwnerOfsTrash(account.address, trashContract, Number(minted));
    const { ownerOfs: vaultsOwnerOfs, getOwnerOfs: getVaultOwnerOfs } = useOwnerOfsTrash(vaultContract?.address, trashContract, Number(minted));
    const { ownerOfs: dumpsterDiversOwnerOfs, getOwnerOfs: getDumpsterDiversOwnersOf}  = useOwnerOfsDumpsterDivers(account.address, dumpsterDiverContract, Number(mintCount));

    const { jsons } = useJsons(trashContract, ownerOfs);
    const { jsons: vaultJsons } = useJsons(trashContract, vaultsOwnerOfs);
    const { jsons: dumpsterDiversJsons} = useJsons(dumpsterDiverContract, dumpsterDiversOwnerOfs);

    const { data: isApprovedForAll} = useScaffoldContractRead({contractName: "Trash", functionName: "isApprovedForAll", args: [account.address, vaultContract?.address]})
    const { writeAsync: setApprovalForAll } = useScaffoldContractWrite({contractName: "Trash", functionName: "setApprovalForAll", args: [vaultContract?.address, true]});
  

    const { writeAsync: burn } = useScaffoldContractWrite({contractName: "DumpsterBin", functionName: "burn", args: [BigInt(0)]});

    const nfts = jsons.map((json, index) => (
      <NftCard key={index} buttonText={isApprovedForAll ? "Swap" : "Approve"} nft={json} onClaimed={
         isApprovedForAll ? async ()=> { await writeAsync({args: [BigInt(json.id)]}); await getOwnerOfs(); await getVaultOwnerOfs(); await getDumpsterDiversOwnersOf() }
         :
         async ()=> { await setApprovalForAll() }
       }/>
    ));

    const vaultsNfts = vaultJsons.map((json, index) => (
      <NftCard key={index} buttonText="" nft={json} onClaimed={async ()=> { await writeAsync({args: [BigInt(json.id)]}); await getOwnerOfs();    }}/>
    ));

    const dumpsterDiversNfts = dumpsterDiversJsons.map((json, index) => (
      <NftCard key={index} buttonText="Burn" nft={json} onClaimed={async ()=> { await burn({args: [BigInt(json.id)]}); await getOwnerOfs(); await getVaultOwnerOfs(); await getDumpsterDiversOwnersOf()}}/>
    ));

  return (
    <>
      <div className="mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Swap</h1>
        <p>Your Dumpster Divers</p>
        <div className="grid grid-cols-5">
        { dumpsterDiversNfts }
        </div>

        <p>Your Trash</p>
        <button onClick={async ()=> { await faucet(); await getOwnerOfs(); await getVaultOwnerOfs(); await getDumpsterDiversOwnersOf() }} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Mint 1 Trash from faucet (This is testnet only functionality)</button>
        <div className="grid grid-cols-5">
        { nfts }
        </div>

        <p>Vault's Trash</p>
        <div className="grid grid-cols-5">
        { vaultsNfts }
        </div>
      </div>
    </>
  );
};

export default SwapComp;
