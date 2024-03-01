"use client";

import { useEffect, useState } from "react";
import { useReadApproves, useReadOwnerOfsDumpsterDivers, useReadOwnerOfsTrash } from "../../../components/hooks";
import { useReadTokenURIs, useReadTokenURIsUTF8 } from "../../../components/hooks";
import { NftCard } from "./NftCard";
import { useAccount } from "wagmi";
import { Balance } from "~~/components/scaffold-eth";
import { Nft } from "~~/components/types";
import { useScaffoldContract, useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export function SwapComp() {
  const account = useAccount();
  const { data: dumpsterDiverContract } = useScaffoldContract({ contractName: "DumpsterDivers" });
  const { data: mintCount } = useScaffoldContractRead({ contractName: "DumpsterDivers", functionName: "getMintCount" });
  const { data: ownedDumpsterDiversOfWallet, refetch: getDumpsterDiversOwnersOf } = useReadOwnerOfsDumpsterDivers(
    account.address,
    mintCount,
    dumpsterDiverContract,
  );

  const { data: jsonsOfOwnedDumpsterDiversOfWallet } = useReadTokenURIs(
    dumpsterDiverContract,
    ownedDumpsterDiversOfWallet,
  );

  const { data: trashContract } = useScaffoldContract({ contractName: "Trash" });
  const { data: vaultContract } = useScaffoldContract({ contractName: "DumpsterBin" });

  const { data: minted } = useScaffoldContractRead({ contractName: "Trash", functionName: "minted" });
  const { data: ownerOfs, refetch: getOwnerOfs } = useReadOwnerOfsTrash(account.address, minted, trashContract);
  const { data: jsons } = useReadTokenURIsUTF8(trashContract, ownerOfs);
  const { data: approves, refetch: getApproves } = useReadApproves(trashContract, ownerOfs);
  const { writeAsync: setApprovalForAll } = useScaffoldContractWrite({
    contractName: "Trash",
    functionName: "approve",
    args: [vaultContract?.address, BigInt(0)],
  });
  const { writeAsync: faucet } = useScaffoldContractWrite({ contractName: "Trash", functionName: "mint" });

  const { data: vaultsOwnerOfs, refetch: getVaultOwnerOfs } = useReadOwnerOfsTrash(
    vaultContract?.address,
    minted,
    trashContract,
  );
  const { data: vaultJsons } = useReadTokenURIsUTF8(trashContract, vaultsOwnerOfs);
  const { writeAsync: burn } = useScaffoldContractWrite({
    contractName: "DumpsterBin",
    functionName: "burn",
    args: [BigInt(0)],
  });

  const { writeAsync: mintDumpsterDiver } = useScaffoldContractWrite({
    contractName: "DumpsterBin",
    functionName: "mint",
    args: [BigInt(0)],
  });

  const { data: weeFee } = useScaffoldContractRead({ contractName: "DumpsterBin", functionName: "getWeeFee" });

  async function refreshPageData() {
    await getOwnerOfs();
    await getVaultOwnerOfs();
    await getDumpsterDiversOwnersOf();
    await getApproves();
  }

  const nfts = jsons.map((json, index) => (
    <NftCard
      key={"trash-" + index}
      buttonText={approves[index] === vaultContract?.address ? "Swap" : "Approve"}
      nft={json}
      onClaimed={
        approves[index] === vaultContract?.address
          ? async () => {
              await mintDumpsterDiver({ args: [BigInt(json.id)] });
              refreshPageData();
            }
          : async () => {
              await setApprovalForAll({ args: [vaultContract?.address, BigInt(json.id)] });
              await refreshPageData();
            }
      }
    />
  ));

  const vaultsNfts = vaultJsons.map((json, index) => <NftCard key={"vault-" + index} nft={json} />);

  const [greensToTransfer, setGreensToTransfer] = useState(0);
  const [yellowsToTransfer, setYellowsToTransfer] = useState(0);
  const [greysToTransfer, setGreysToTransfer] = useState(0);
  const [bluesToTransfer, setBluesToTransfer] = useState(0);
  const [pinksToTransfer, setPinksToTransfer] = useState(0);

  const [greens, setGreens] = useState<Nft[]>([]);
  const [yellows, setYellows] = useState<Nft[]>([]);
  const [greys, setGreys] = useState<Nft[]>([]);
  const [blues, setBlues] = useState<Nft[]>([]);
  const [pinks, setPinks] = useState<Nft[]>([]);

  useEffect(() => {
    const greensArr = [];
    const yellowsArr = [];
    const bluesArr = [];
    const pinksArr = [];
    const greysArr = [];

    for (let i = 0; i < jsons.length; i++) {
      for (let j = 0; j < jsons[i].attributes.length; j++) {
        if (jsons[i].attributes[j].value === "Green") {
          greensArr.push(jsons[i]);
        } else if (jsons[i].attributes[j].value === "Yellow") {
          yellowsArr.push(jsons[i]);
        } else if (jsons[i].attributes[j].value === "Blue") {
          bluesArr.push(jsons[i]);
        } else if (jsons[i].attributes[j].value === "Grey") {
          greysArr.push(jsons[i]);
        } else if (jsons[i].attributes[j].value === "Pink") {
          pinksArr.push(jsons[i]);
        }
      }
    }

    setGreens([...greensArr]);
    setYellows([...yellowsArr]);
    setGreys([...greysArr]);
    setBlues([...bluesArr]);
    setPinks([...pinksArr]);
  }, [jsons]);

  console.log(greens);
  console.log(yellows);

  const dumpsterDiversNfts = jsonsOfOwnedDumpsterDiversOfWallet.map((json, index) => (
    <NftCard
      key={"dumpsterDivers-" + index}
      buttonText="Burn"
      nft={json}
      onClaimed={async () => {
        await burn({ args: [BigInt(json.id)], value: weeFee });
        refreshPageData();
      }}
    />
  ));

  return (
    <>
      <div className="mt-8 bg-secondary p-10">
        <p className="text-4xl">Your Dumpster Divers</p>
        <div className="grid grid-cols-5"> {dumpsterDiversNfts} </div>
        <p className="text-4xl">Your Trash</p>
        <button
          onClick={async () => {
            await faucet();
            refreshPageData();
          }}
          className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Mint 1 Trash from faucet (This is testnet only functionality)
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setGreensToTransfer(greensToTransfer - 1 > 0 ? greensToTransfer - 1 : 0);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setGreensToTransfer(greensToTransfer + 1 <= greens.length ? greensToTransfer + 1 : greens.length);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {">"}
          </button>
          <p>Greens To Transfer: {greensToTransfer} </p>
          <button
            onClick={async () => {
              for (let i = 0; i < greensToTransfer; i++) {
                await setApprovalForAll({ args: [vaultContract?.address, BigInt(greens[i].id)] });
                await refreshPageData();
                await mintDumpsterDiver({ args: [BigInt(greens[i].id)] });
                refreshPageData();
              }
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Transfer
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setYellowsToTransfer(yellowsToTransfer - 1 > 0 ? yellowsToTransfer - 1 : 0);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setYellowsToTransfer(yellowsToTransfer + 1 <= yellows.length ? yellowsToTransfer + 1 : yellows.length);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {">"}
          </button>
          <p>Yellows To Transfer: {yellowsToTransfer} </p>
          <button
            onClick={async () => {
              for (let i = 0; i < yellowsToTransfer; i++) {
                await setApprovalForAll({ args: [vaultContract?.address, BigInt(yellows[i].id)] });
                await refreshPageData();
                await mintDumpsterDiver({ args: [BigInt(yellows[i].id)] });
                refreshPageData();
              }
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Transfer
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setGreysToTransfer(greysToTransfer - 1 > 0 ? greysToTransfer - 1 : 0);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setGreysToTransfer(greysToTransfer + 1 <= greys.length ? greysToTransfer + 1 : greys.length);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {">"}
          </button>
          <p>Greys To Transfer: {greysToTransfer} </p>
          <button
            onClick={async () => {
              for (let i = 0; i < greysToTransfer; i++) {
                await setApprovalForAll({ args: [vaultContract?.address, BigInt(greys[i].id)] });
                await refreshPageData();
                await mintDumpsterDiver({ args: [BigInt(greys[i].id)] });
                refreshPageData();
              }
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Transfer
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setPinksToTransfer(pinksToTransfer - 1 > 0 ? pinksToTransfer - 1 : 0);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setPinksToTransfer(pinksToTransfer + 1 <= pinks.length ? pinksToTransfer + 1 : pinks.length);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {">"}
          </button>
          <p>Pinks To Transfer: {pinksToTransfer} </p>
          <button
            onClick={async () => {
              for (let i = 0; i < pinksToTransfer; i++) {
                await setApprovalForAll({ args: [vaultContract?.address, BigInt(pinks[i].id)] });
                await refreshPageData();
                await mintDumpsterDiver({ args: [BigInt(pinks[i].id)] });
                refreshPageData();
              }
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Transfer
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setBluesToTransfer(bluesToTransfer - 1 > 0 ? bluesToTransfer - 1 : 0);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {"<"}
          </button>
          <button
            onClick={() => {
              setBluesToTransfer(bluesToTransfer + 1 <= blues.length ? bluesToTransfer + 1 : blues.length);
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            {">"}
          </button>
          <p>Blues To Transfer: {bluesToTransfer} </p>
          <button
            onClick={async () => {
              for (let i = 0; i < bluesToTransfer; i++) {
                await setApprovalForAll({ args: [vaultContract?.address, BigInt(blues[i].id)] });
                await refreshPageData();
                await mintDumpsterDiver({ args: [BigInt(blues[i].id)] });
                refreshPageData();
              }
            }}
            className="bg-transparent hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Transfer
          </button>
        </div>

        <br />
        <br />
        <div className="grid grid-cols-5">{nfts}</div>

        <p className="text-4xl">Vaults Trash</p>
        <Balance address={vaultContract?.address} />

        <div className="grid grid-cols-5">{vaultsNfts}</div>
      </div>
    </>
  );
}

export default SwapComp;
