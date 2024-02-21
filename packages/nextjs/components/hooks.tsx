import { useState, useEffect } from "react";
import { Address } from "viem";
import { Nft } from "./types";

export function useOwnerOfsDumpsterDivers(accountAddress: string | undefined, trashContract: any, minted: number) {
    const [ownerOfs, setOwnerOfs] = useState<number[]>([]);

    async function getOwnerOfs() {
        if (!minted)
            return;
  
        const arr = [];
        for (let i = 0; i < minted ; i++) {
  
            const doesExist = await trashContract?.read.tokenExists([BigInt(i)]);

            if (doesExist) {
                const ownerOf = await trashContract?.read.ownerOf([BigInt(i)]);
                if (ownerOf === accountAddress) {
                    arr.push(i);
                }
            }
        }
  
        setOwnerOfs([...arr]);
    }
  
      useEffect(()=> {
          getOwnerOfs();
      },[minted])


      return { ownerOfs, getOwnerOfs};
}

export function useOwnerOfsTrash(accountAddress: string | undefined, trashContract: any, minted: number) {
    const [ownerOfs, setOwnerOfs] = useState<number[]>([]);

    async function getOwnerOfs() {
        if (!minted)
            return;
  
        const arr = [];
        for (let i = 1; i <= minted ; i++) {
            
                    const ownerOf = await trashContract?.read.ownerOf([BigInt(i)]);
                    if (ownerOf === accountAddress) {
                        arr.push(i);
                    }
                
        }
  
        setOwnerOfs([...arr]);
    }
  
      useEffect(()=> {
          getOwnerOfs();
      },[minted])


      return { ownerOfs, getOwnerOfs};
}

export function useJsons(nftContract: any, ownerOfs: number[]) {
    const [jsons, setJsons] = useState<Nft[]>([]);

    async function getJsons() {

        if (ownerOfs === undefined)
          return;
      
        const arr: Nft[] = [];
        for (let i = 0; i < ownerOfs.length ; i++) {
      
          const dataURI = await nftContract?.read.tokenURI([BigInt(ownerOfs[i])]);
      
          const data = Buffer.from(dataURI!.substring(27), "utf-8").toString();
          const json = JSON.parse(data);
          json["id"] = ownerOfs[i];
          arr.push(json);
        }
      
        setJsons([...arr]);
      }
      

useEffect(()=> {
    getJsons();
  }, [ownerOfs])

  return { jsons, getJsons };

}
