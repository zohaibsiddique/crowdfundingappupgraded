import { BrowserProvider, ethers } from "ethers";
import { CROWDFUNDING_ABI } from "./crowdfunding-abi";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const connectCrowdfundingContract = async (compaignAddress:any) => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(
    compaignAddress,
    CROWDFUNDING_ABI,
    await signer
  );

  return contract;
};
