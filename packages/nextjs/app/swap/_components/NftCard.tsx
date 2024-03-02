import { Nft } from "~~/components/types";

interface NftCardProps {
  nft: Nft;
  buttonText?: string;
  onClaimed?: () => Promise<void>;
}

export const NftCard = (props: NftCardProps) => {
  return (
    <div className="flex flex-col items-center bg-slate m-1 p-1">
      {props?.nft?.image ? (
        <img src={props?.nft?.image.replace("ipfs://", "https://nftstorage.link/ipfs/")} width={128} height={128} />
      ) : (
        <></>
      )}
      <p>{props.nft.name}</p>
    </div>
  );
};
