import { createWalletClient, http } from "viem";
import * as chains from "viem/chains";

export const walletClientSelector = (networkName: string, account: string) => {
  const selectedChain = chains[networkName as keyof typeof chains];
  if (networkName === "mainnet") {
    const publicClient = createWalletClient({
      account: account,
      chain: selectedChain,
      transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "sepolia") {
    const publicClient = createWalletClient({
      account: account,
      chain: selectedChain,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "arbitrum") {
    const publicClient = createWalletClient({
      account: account,
      chain: selectedChain,
      transport: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else {
    console.log("chain not available");
  }
};
