import { Nft } from "~~/components/types";

interface NftCardProps {
  nft: Nft;
  buttonText?: string;
  onClaimed?: () => Promise<void>;
}

export const NftCard = (props: NftCardProps) => {
  console.log(props.nft.id);

  console.log(props.nft.image);

  let attributesOutput;
  if (props?.nft?.attributes?.length > 0) {
    attributesOutput = props?.nft?.attributes?.map((attribute, index) => (
      <p key={index}>
        {attribute["trait_type"]}: {attribute["value"]}
      </p>
    ));
  }

  return (
    <div className="flex flex-col items-center bg-black m-1 p-1">
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
      <p>{props.nft.name}</p>
      <p className="-m-2">Token ID: {props.nft.id.toString()}</p>
      {attributesOutput}
      {props?.nft?.image ? (
        <img src={props?.nft?.image.replace("ipfs://", "https://nftstorage.link/ipfs/")} width={128} height={128} />
      ) : (
        <></>
      )}
    </div>
  );
};
