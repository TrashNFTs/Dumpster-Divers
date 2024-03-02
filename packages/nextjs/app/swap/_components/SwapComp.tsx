"use client";

import { useEffect, useState } from "react";
import { useReadApproves, useReadOwnerOfsDumpsterDivers, useReadOwnerOfsTrash } from "../../../components/hooks";
import { useReadTokenURIs, useReadTokenURIsUTF8 } from "../../../components/hooks";
import blue from "../../../public/BLUE.PNG";
import green from "../../../public/GREEN.PNG";
import grey from "../../../public/GREY.PNG";
import pink from "../../../public/PINK.PNG";
import yellow from "../../../public/YELLOW.PNG";
import { NftCard } from "./NftCard";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useAccount } from "wagmi";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
//import { Balance } from "~~/components/scaffold-eth";
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
  //const { writeAsync: faucet } = useScaffoldContractWrite({ contractName: "Trash", functionName: "mint" });

  /*

  const { data: vaultsOwnerOfs, refetch: getVaultOwnerOfs } = useReadOwnerOfsTrash(
    vaultContract?.address,
    minted,
    trashContract,
  );

  const { data: vaultJsons } = useReadTokenURIsUTF8(trashContract, vaultsOwnerOfs);
  
  */

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
    // await getVaultOwnerOfs();
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

  //const vaultsNfts = vaultJsons.map((json, index) => <NftCard key={"vault-" + index} nft={json} />);

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

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <div className="absolute top-20 right-20 flex z-10">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
      <div className="bg-header bg-top bg-no-repeat bg-contain">
        <div className="lg:mt-96 mt-32 p-10">
          <Tabs
            selectedIndex={tabIndex}
            onSelect={index => setTabIndex(index)}
            selectedTabClassName="bg-black text-white"
          >
            <TabList className="flex lg:m-20 bg-white">
              <Tab className="cursor-pointer lg:ml-20 lg:mr-20 py-4 px-8 rounded-full border flex-1">
                <h2 className="w-full text-2xl text-center">TRASH</h2>
              </Tab>
              <Tab className="cursor-pointer lg:ml-20 lg:mr-20 py-4 px-8 rounded-full border flex-1">
                <h2 className="w-full text-2xl text-center">DIVERS</h2>
              </Tab>
            </TabList>

            <TabPanel className="border">
              <div className="lg:flex m-top bg-transparent">
                <div className="lg:flex-1 m-10">
                  <h1 className="text-3xl text-center">BAG</h1>
                  <p className="text-center">
                    Minting a Dumpster Diver costs 1 $TRASH. <br />
                    You can buy $TRASH with ETH or DEGEN on{" "}
                    <a
                      href="https://app.uniswap.org/explore/tokens/base/0xdf00fde26a6819507649904ca52fe5062ef75ba7"
                      className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    >
                      Uniswap
                    </a>
                    .
                  </p>
                  <div className="grid grid-cols-5">{nfts}</div>
                </div>

                <div className="flex-1 m-10">
                  <h1 className="text-3xl text-center">DUMPSTER DEPOSIT</h1>
                  <p className="text-center">
                    When you stash your $TRASH in the Dumpster, a Dumpster Diver is born. <br />
                    Rare trash attracts more exclusive Dumpster Divers.
                  </p>

                  <div className="lg:grid lg:grid-cols-2">
                    <div className="flex m-5">
                      <button
                        onClick={() => {
                          setGreysToTransfer(greysToTransfer - 1 > 0 ? greysToTransfer - 1 : 0);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {"<"}
                      </button>

                      <div className="relative w-40 h-40 overflow-hidden">
                        <img src={grey.src} alt="GreyTrash" className="object-cover w-full h-full" />
                        <div className="absolute w-full py-2.5 bottom-0 inset-x-0 bg-gray-500/50 text-white text-xs text-center leading-4">
                          {greysToTransfer} / {greys.length}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setGreysToTransfer(greysToTransfer + 1 <= greys.length ? greysToTransfer + 1 : greys.length);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="flex m-5">
                      <button
                        onClick={() => {
                          setBluesToTransfer(bluesToTransfer - 1 > 0 ? bluesToTransfer - 1 : 0);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {"<"}
                      </button>

                      <div className="relative w-40 h-40 overflow-hidden">
                        <img src={blue.src} alt="BlueTrash" className="object-cover w-full h-full" />
                        <div className="absolute w-full py-2.5 bottom-0 inset-x-0 bg-sky-500/50 text-white text-xs text-center leading-4">
                          {bluesToTransfer} / {blues.length}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setBluesToTransfer(bluesToTransfer + 1 <= blues.length ? bluesToTransfer + 1 : blues.length);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="flex m-5">
                      <button
                        onClick={() => {
                          setGreensToTransfer(greensToTransfer - 1 > 0 ? greensToTransfer - 1 : 0);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {"<"}
                      </button>

                      <div className="relative w-40 h-40 overflow-hidden">
                        <img src={green.src} alt="GreenTrash" className="object-cover w-full h-full" />
                        <div className="absolute w-full py-2.5 bottom-0 inset-x-0 bg-green-500/50 text-white text-xs text-center leading-4">
                          {greensToTransfer} / {greens.length}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setGreensToTransfer(
                            greensToTransfer + 1 <= greens.length ? greensToTransfer + 1 : greens.length,
                          );
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="flex m-5">
                      <button
                        onClick={() => {
                          setYellowsToTransfer(yellowsToTransfer - 1 > 0 ? yellowsToTransfer - 1 : 0);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {"<"}
                      </button>

                      <div className="relative w-40 h-40 overflow-hidden">
                        <img src={yellow.src} alt="YellowTrash" className="object-cover w-full h-full" />
                        <div className="absolute w-full py-2.5 bottom-0 inset-x-0 bg-yellow-500/50 text-white text-xs text-center leading-4">
                          {yellowsToTransfer} / {yellows.length}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setYellowsToTransfer(
                            yellowsToTransfer + 1 <= yellows.length ? yellowsToTransfer + 1 : yellows.length,
                          );
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="flex m-5">
                      <button
                        onClick={() => {
                          setPinksToTransfer(pinksToTransfer - 1 > 0 ? pinksToTransfer - 1 : 0);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {"<"}
                      </button>

                      <div className="relative w-40 h-40 overflow-hidden">
                        <img src={pink.src} alt="PinkTrash" className="object-cover w-full h-full" />
                        <div className="absolute w-full py-2.5 bottom-0 inset-x-0 bg-pink-500/50 text-white text-xs text-center leading-4">
                          {pinksToTransfer} / {pinks.length}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setPinksToTransfer(pinksToTransfer + 1 <= pinks.length ? pinksToTransfer + 1 : pinks.length);
                        }}
                        className="flex-1 bg-white hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        {">"}
                      </button>
                    </div>

                    <div className="flex m-5">
                      <button
                        onClick={async () => {
                          for (let i = 0; i < greysToTransfer; i++) {
                            await setApprovalForAll({ args: [vaultContract?.address, BigInt(greys[i].id)] });
                            await refreshPageData();
                            await mintDumpsterDiver({ args: [BigInt(greys[i].id)] });
                            refreshPageData();
                          }
                          for (let i = 0; i < bluesToTransfer; i++) {
                            await setApprovalForAll({ args: [vaultContract?.address, BigInt(blues[i].id)] });
                            await refreshPageData();
                            await mintDumpsterDiver({ args: [BigInt(blues[i].id)] });
                            refreshPageData();
                          }
                          for (let i = 0; i < greensToTransfer; i++) {
                            await setApprovalForAll({ args: [vaultContract?.address, BigInt(greens[i].id)] });
                            await refreshPageData();
                            await mintDumpsterDiver({ args: [BigInt(greens[i].id)] });
                            refreshPageData();
                          }
                          for (let i = 0; i < yellowsToTransfer; i++) {
                            await setApprovalForAll({ args: [vaultContract?.address, BigInt(yellows[i].id)] });
                            await refreshPageData();
                            await mintDumpsterDiver({ args: [BigInt(yellows[i].id)] });
                            refreshPageData();
                          }
                          for (let i = 0; i < pinksToTransfer; i++) {
                            await setApprovalForAll({ args: [vaultContract?.address, BigInt(pinks[i].id)] });
                            await refreshPageData();
                            await mintDumpsterDiver({ args: [BigInt(pinks[i].id)] });
                            refreshPageData();
                          }
                          setTabIndex(1);
                        }}
                        className="flex-1 bg-blue-200 hover:bg-blue-500 text-white-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        STASH MY TRASH
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="grid grid-cols-5"> {dumpsterDiversNfts} </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default SwapComp;
