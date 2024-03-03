import { useCallback, useEffect, useState } from "react";
import { Nft } from "./types";
import { Alchemy, Network } from "alchemy-sdk";

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

export function useMe(userAddr: string | undefined, trashAddr: string | undefined) {
  const [ownedNfts, setOwnedNfts] = useState<any>();

  useEffect(() => {
    async function get() {
      if (!userAddr || !trashAddr) return;

      const alchemy = new Alchemy(settings);

      const ownerAddr = userAddr;
      console.log("fetching NFTs for address:", ownerAddr);
      console.log("...");

      // Print total NFT count returned in the response:
      const nftsForOwner = await alchemy.nft.getNftsForOwner(userAddr);

      const nfts = [];

      // Print contract address and tokenId for each NFT:
      for (const nft of nftsForOwner.ownedNfts) {
        // nft.
        console.log("===");
        console.log("contract address:", nft.contract.address);
        console.log("token ID:", nft.tokenId);
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
