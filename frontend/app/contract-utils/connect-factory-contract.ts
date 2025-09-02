import { BrowserProvider, ethers } from "ethers";
import { CROWDFUNDING_FACTORY_ABI, CROWDFUNDING_FACTORY_ADDRESS } from "./crowdfundingfactory-abi";

export const connectFactoryContract = async () => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(
    CROWDFUNDING_FACTORY_ADDRESS,
    CROWDFUNDING_FACTORY_ABI,
    signer
  );

  const paused = await contract.paused();
  console.log("Paused status:", paused);

  const factoryAddress = contract.target;
  const contractAddress = CROWDFUNDING_FACTORY_ADDRESS;

  const network = await provider.getNetwork();

  return { contract, paused, network, provider, factoryAddress, contractAddress};
};
