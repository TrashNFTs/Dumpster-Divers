import { useCallback, useEffect, useState } from "react";
import { Nft } from "./types";
// import { EvmChain } from "@moralisweb3/common-evm-utils";
import { Alchemy, Network } from "alchemy-sdk";

// import api from "api";
// import Moralis from "moralis";

const settings = {
  apiKey: "evS55XS3rdRbTDvoSxWFz71IBJv_Mw1B", // Replace with your Alchemy API Key.
  network: Network.BASE_MAINNET, // Replace with your network.
};

export function useReadOwnerOfsDumpsterDivers(
  accountAddress: string | undefined,
  mintCount: bigint | undefined,
  dumpsterDiverContract: any | undefined,
) {
  const [data, setData] = useState<bigint[]>([]);

  const refetch = useCallback(async () => {
    const arr: bigint[] = [];

    for (let i = 0; i < Number(mintCount); i++) {
      const doesExist = await dumpsterDiverContract?.read.tokenExists([BigInt(i)]);

      if (doesExist) {
        const ownerOf = await dumpsterDiverContract?.read.ownerOf([BigInt(i)]);
        if (ownerOf === accountAddress) {
          arr.push(BigInt(i));
        }
      }
    }

    setData([...arr]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountAddress, mintCount, dumpsterDiverContract?.address]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch };
}

const nemonicKey = "HZcumaNRBY7uW6h4he9FpOymuYejgSPOzbjgUYsnEFFbG9kQ";

export function useMe2(userAddr: string | undefined, trashAddr: string | undefined) {
  // const sdk = api("@simplehash/v0.1#ritrjmmlmgi2upk");

  const [ownedNfts, setOwnedNfts] = useState<any>();

  useEffect(() => {
    async function test() {
      if (!trashAddr) return;
      if (!userAddr) return;

      const response = await fetch(
        `https://base-rest.api.mnemonichq.com/wallets/v1beta2/${userAddr}/nfts?limit=500&contractAddress=${trashAddr}`,
        {
          headers: {
            "X-API-Key": nemonicKey,
            "Content-Type": "application/json",
          },
        },
      );

      const json = await response.json();

      const nfts = [];

      for (const nft of json.nfts) {
        console.log(nft.nft.tokenId);

        nfts.push(nft.nft.tokenId);
      }

      setOwnedNfts([...nfts]);

      // sdk.auth(nemonicKey);
      // await Moralis.start({
      //   apiKey: "3238c83a-980d-40b3-80ba-25691628b717",
      //   // ...and any other configuration
      // });
      // const chain = EvmChain.BASE;

      // const response = await Moralis.EvmApi.nft.getWalletNFTCollections({
      //   address: userAddr,
      //   chain,
      // });

      // console.log(response.toJSON());

      // for (let i = 0; i < 10000; i++) {
      //   let j = i.toString();

      //   try {
      //     const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
      //       address,
      //       chain,
      //       tokenId: j,
      //     });

      //     console.log(response.toJSON());
      //   } catch (e) {
      //     console.log("Wrong token!");
      //   }
      // }
    }

    test();
  }, [userAddr, trashAddr]);

  return ownedNfts;

  // sdk.server("https://base-rest.api.mnemonichq.com");

  // let data = await sdk.walletsService_GetNfts({ contractAddress: trashAddr, walletAddress: userAddr });
  // console.log(data);
}

export function useMe(userAddr: string | undefined, trashAddr: string | undefined) {
  const [ownedNfts, setOwnedNfts] = useState<any>();

  useEffect(() => {
    async function get() {
      if (!userAddr || !trashAddr) return;

      const alchemy = new Alchemy(settings);

      // const ownerAddr = userAddr;
      const nftsForOwner = await alchemy.nft.getNftsForOwner(userAddr);

      const nfts = [];

      // Print contract address and tokenId for each NFT:
      for (const nft of nftsForOwner.ownedNfts) {
        // nft.
        // console.log("===");
        // console.log("contract address:", nft.contract.address);
        // console.log("token ID:", nft.tokenId);
        nfts.push(nft.tokenId);

        // const response = await alchemy.nft.getNftMetadata(trashAddr, "1590");

        // console.log("NFT name: ", response.name);
        // console.log("token type: ", response.tokenType);
        // console.log("tokenUri: ", response.tokenUri);
        // console.log("image url: ", response.image);
        // console.log("raw data: ", response.raw);
        // console.log("time last updated: ", response.timeLastUpdated);
        // console.log("===");

        // nfts.push(response);
      }

      setOwnedNfts([...nfts]);
    }
    get();
  }, [userAddr, trashAddr]);

  return ownedNfts;
}

export function useReadOwnerOfsTrash(
  accountAddress: string | undefined,
  mintCount: bigint | undefined,
  trashContract: any | undefined,
) {
  const [data, setData] = useState<bigint[]>([]);

  const refetch = useCallback(async () => {
    if (!mintCount) return;
    if (!accountAddress) return;
    if (!trashContract) return;

    const arr: bigint[] = [];
    for (let i = 1; i <= Number(mintCount); i++) {
      try {
        const ownerOf = await trashContract?.read.ownerOf([BigInt(i)]);
        if (ownerOf === accountAddress) {
          arr.push(BigInt(i));
        }
      } catch (e) {
        // console.log("moving on...");
      }
    }

    setData([...arr]);
  }, [accountAddress, mintCount, trashContract?.address]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch };
}

export function useReadTokenURIsUTF8(nftContract: any | undefined, tokenIds: bigint[] | undefined) {
  const [data, setData] = useState<Nft[]>([]);

  const [isFetching, setIsFetching] = useState(true);

  const refetch = useCallback(async () => {
    if (!tokenIds) return;
    if (tokenIds.length <= 0) return;

    const arr: Nft[] = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const dataURI = await nftContract?.read.tokenURI([tokenIds[i]]);

      const data = Buffer.from(dataURI.substring(27), "utf-8").toString();
      const json = JSON.parse(data);
      json["id"] = tokenIds[i];
      arr.push(json);
    }

    setData([...arr]);
    setIsFetching(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftContract?.address, tokenIds]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch, isFetching };
}

export function useReadTokenURIs(nftContract: any | undefined, tokenIds: bigint[] | undefined) {
  const [data, setData] = useState<Nft[]>([]);

  const refetch = useCallback(async () => {
    if (!tokenIds) return;

    const arr: Nft[] = [];
    for (let i = 0; i < tokenIds.length; i++) {
      let dataURI = await nftContract?.read.tokenURI([tokenIds[i]]);
      dataURI = dataURI.replace("ipfs://", "https://nftstorage.link/ipfs/");
      // console.log(dataURI);

      const q = await fetch(dataURI);

      const json = await q.json();
      json["id"] = tokenIds[i];
      arr.push(json);
    }

    setData([...arr]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftContract?.address, tokenIds]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch };
}

export function useReadApproves(nftContract: any, tokenIds: bigint[]) {
  const [data, setData] = useState<string[]>([]);

  const refetch = useCallback(async () => {
    if (tokenIds === undefined) return;

    const arr: string[] = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const _value = await nftContract?.read.getApproved([tokenIds[i]]);
      arr.push(_value);
    }

    setData([...arr]);
  }, [nftContract?.address, tokenIds]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch };
}
