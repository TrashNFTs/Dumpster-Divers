import { Nft } from "~~/components/types";

interface NftCardProps {
  nft: Nft;
  buttonText?: string;
  onClaimed?: () => Promise<void>;
}

export const NftCard = (props: NftCardProps) => {
  // let attributesOutput;
  // if (props?.nft?.attributes?.length > 0) {
  //   attributesOutput = props?.nft?.attributes?.map((attribute, index) => (
  //     <p key={index}>
  //       {attribute["trait_type"]}: {attribute["value"]}
  //     </p>
  //   ));
  // }

  return (
    <div className="flex flex-col items-center bg-slate m-1 p-1">
      {props?.nft?.image ? (
        <img src={props?.nft?.image.replace("ipfs://", "https://ipfs.io/ipfs/")} width={128} height={128} />
      ) : (
        <></>
      )}
      <p>{props.nft.name}</p>
    </div>
  );
};
