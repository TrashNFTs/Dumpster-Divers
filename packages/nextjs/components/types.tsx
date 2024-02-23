export interface Nft {
  name: string;
  description: string;
  image: string;
  attributes: {"trait_type": string, "value": string}[];
  id: number;
}
