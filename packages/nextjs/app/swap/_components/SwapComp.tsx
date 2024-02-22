"use client";

import { useReadApproves, useReadOwnerOfsDumpsterDivers, useReadOwnerOfsTrash } from "../../../components/hooks";
import { useReadTokenURIsUTF8 } from "../../../components/hooks";
import { NftCard } from "./NftCard";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";



export function SwapComp() {
  const account = useAccount();
  const { data: dumpsterDiverContract } = useScaffoldContract({ contractName: "DumpsterDivers" });
  const { data: mintCount } = useScaffoldContractRead({ contractName: "DumpsterDivers", functionName: "getMintCount" });
  const { data: ownedDumpsterDiversOfWallet, refetch: getDumpsterDiversOwnersOf } = useReadOwnerOfsDumpsterDivers(
    account.address,
    mintCount,
    dumpsterDiverContract
  );






  // const {data: trashContract} = useScaffoldContract({contractName: "Trash"});
  const {data: vaultContract} = useScaffoldContract({contractName: "DumpsterBin"});



  // const { writeAsync: faucet} = useScaffoldContractWrite({contractName: "Trash", functionName: "mint"});

  // const { writeAsync } = useScaffoldContractWrite({contractName: "DumpsterBin", functionName: "mint", args: [BigInt(0)]});

  // const { data: minted } = useScaffoldContractRead({ contractName: "Trash", functionName: "minted"});
  // const { data: ownerOfs, refetch: getOwnerOfs } = useReadOwnerOfsTrash(account.address, trashContract, Number(minted));
  // const { data: jsons } = useReadTokenURIsUTF8(trashContract, ownerOfs);
  // const { data: approves, refetch: getApproves } = useReadApproves(trashContract, ownerOfs);
  // const { writeAsync: setApprovalForAll } = useScaffoldContractWrite({contractName: "Trash", functionName: "approve", args: [vaultContract?.address, BigInt(0)]});

  // const { data: vaultsOwnerOfs, refetch: getVaultOwnerOfs } = useReadOwnerOfsTrash(vaultContract?.address, trashContract, Number(minted));
  // const { data: vaultJsons } = useReadTokenURIsUTF8(trashContract, vaultsOwnerOfs);
  const { writeAsync: burn } = useScaffoldContractWrite({contractName: "DumpsterBin", functionName: "burn", args: [BigInt(0)]});

  
  const { data: jsonsOfOwnedDumpsterDiversOfWallet} = useReadTokenURIsUTF8(dumpsterDiverContract, ownedDumpsterDiversOfWallet);

  async function refreshPageData() {
    // await getOwnerOfs();
    // await getVaultOwnerOfs();
    // await getDumpsterDiversOwnersOf();
    // await getApproves();
  }

  // const nfts = jsons.map((json, index) => (
  //   <NftCard key={"trash-" + index} buttonText={approves[index] === vaultContract?.address ? "Swap" : "Approve"} nft={json} onClaimed={
  //      (approves[index] === vaultContract?.address) ? async ()=> { await writeAsync({args: [BigInt(json.id)]}); refreshPageData() }
  //      :
  //      async ()=> { await setApprovalForAll({args: [vaultContract?.address, BigInt(json.id)]}); await refreshPageData() }
  //    }/>
  // ));

  // const vaultsNfts = vaultJsons.map((json, index) => (
  //   <NftCard key={"vault-" + index} buttonText="" nft={json} onClaimed={async ()=> { await writeAsync({args: [BigInt(json.id)]}); await getOwnerOfs();    }}/>
  // ));

  const dumpsterDiversNfts = jsonsOfOwnedDumpsterDiversOfWallet.map((json, index) => (
    <NftCard key={"dumpsterDivers-"+ index} buttonText="Burn" nft={json} onClaimed={async ()=> { await burn({args: [BigInt(json.id)]}); refreshPageData() }}/>
  ));

  console.log("hello");

  return (
    <>
      <div className="mt-8 bg-secondary p-10">
        <h1 className="text-4xl my-0">Swap</h1>

        <p>Your Dumpster Divers</p>
        {/* <div className="grid grid-cols-5"> { dumpsterDiversNfts } </div> */}
        {/*
        <p>Your Trash</p>
        <button onClick={async ()=> { await faucet(); refreshPageData() }} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Mint 1 Trash from faucet (This is testnet only functionality)</button>
        <div className="grid grid-cols-5">
        { nfts }
        </div>

        <p>Vaults Trash</p>
        <div className="grid grid-cols-5">
        { vaultsNfts }
        </div> */}
      </div>
    </>
  );
}

export default SwapComp;
