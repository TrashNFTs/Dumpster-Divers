import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useScaffoldContract, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import SwapComp from "./_components/SwapComp";

export const metadata = getMetadata({
  title: "Dumpster Bin Swap",
  description: "Swap your Dumpster Bins!",
});

const Swap: NextPage = () => {
  return (
    <>
    <SwapComp/>
    </>
  );
};

export default Swap;
