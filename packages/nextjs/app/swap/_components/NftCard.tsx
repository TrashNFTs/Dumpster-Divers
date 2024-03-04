import { Nft } from "~~/components/types";

interface NftCardProps {
  nft: Nft;
  buttonText?: string;
  onClaimed?: () => Promise<void>;
}

export const NftCard = (props: NftCardProps) => {
  // console.log(props.nft);

  return (
    <div className="flex flex-col items-center bg-slate m-1 p-1">
      {props?.nft?.image ? (
        <img src={props?.nft?.image.replace("ipfs://", "https://nftstorage.link/ipfs/")} width={128} height={128} />
      ) : (
        <></>
      )}

      <p>{props.nft.name}</p>

      {props.buttonText ? (
        <button
          onClick={async () => {
            if (props.onClaimed) await props.onClaimed();
          }}
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          {props.buttonText}
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};
