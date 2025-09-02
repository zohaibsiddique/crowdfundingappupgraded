import { BrowserProvider, JsonRpcSigner } from "ethers";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    ethereum?: any;
  }
}

type WalletConnection = {
  provider: BrowserProvider;
  signer: JsonRpcSigner;
  address: string;
} | null;

export const connectWallet = async (): Promise<WalletConnection> => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!window.ethereum) {
    if (isMobile) {
      window.location.href = `https://metamask.app.link/dapp/${window.location.hostname}${window.location.pathname}`;
      return null;
    } else {
      alert("MetaMask not found. Please install it.");
      return null;
    }
  }

  try {
    const provider = new BrowserProvider(window.ethereum);
    // ✅ Explicitly request accounts before `getSigner()`
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    localStorage.setItem("walletConnected", "true");

    return { provider, signer, address };

    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    // Helpful log for debugging
    console.error("Error connecting wallet:", error);

    if (error.code === -32002) {
      alert(
        "MetaMask is already waiting for you to connect. Please check the MetaMask popup."
      );
    } else {
      alert(error.message || "Error connecting wallet");
    }

    return null;
  }
};
