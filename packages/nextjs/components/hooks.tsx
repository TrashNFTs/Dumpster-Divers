import { useCallback, useEffect, useState } from "react";
import { Nft } from "./types";

export function useReadOwnerOfsDumpsterDivers(
  accountAddress: string | undefined,
  mintCount: bigint | undefined,
  dumpsterDiverContract: any | undefined
) {
  const [data, setData] = useState<bigint[]>([]);

  const refetch = useCallback(async ()=> {

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

export function useReadOwnerOfsTrash(accountAddress: string | undefined, trashContract: any | undefined, mintCount: number | undefined) {
  const [data, setData] = useState<number[]>([]);

  const refetch = useCallback(async () => {
    if (!mintCount) return;
    if (!accountAddress) return;
    if (!trashContract) return;

    const arr = [];
    for (let i = 1; i <= mintCount; i++) {
      const ownerOf = await trashContract?.read.ownerOf([BigInt(i)]);
      if (ownerOf === accountAddress) {
        arr.push(i);
      }
    }

    setData([...arr]);
  }, [accountAddress, mintCount, trashContract]);

  // useEffect(() => {
  //   refetch();
  // }, [accountAddress, mintCount, trashContract?.read, refetch]);

  return { data, refetch };
}

export function useReadTokenURIsUTF8(nftContract: any | undefined, tokenIds: bigint[] | undefined) {
  const [data, setData] = useState<Nft[]>([]);

  const refetch = useCallback(async () => {
    if (!tokenIds)
      return;

    const arr: Nft[] = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const dataURI = await nftContract?.read.tokenURI([tokenIds[i]]);

      const data = Buffer.from(dataURI.substring(27), "utf-8").toString();
      const json = JSON.parse(data);
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

export function useReadApproves(nftContract: any, tokenIds: number[]) {
  const [data, setData] = useState<string[]>([]);

  const refetch = useCallback(async () => {
    if (tokenIds === undefined) return;

    const arr: string[] = [];
    for (let i = 0; i < tokenIds.length; i++) {
      const _value = await nftContract?.read.getApproved([BigInt(tokenIds[i])]);
      arr.push(_value);
    }

    setData([...arr]);
  }, [nftContract, tokenIds]);

  useEffect(() => {
    refetch();
  }, [tokenIds, refetch]);

  return { data, refetch };
}
