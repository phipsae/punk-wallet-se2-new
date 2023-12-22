import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";

export const publicClientSelector = (networkName: string) => {
  const selectedChain = chains[networkName as keyof typeof chains];
  if (networkName === "mainnet") {
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "sepolia") {
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "arbitrum") {
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(`https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "goerli") {
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else if (networkName === "optimism") {
    const publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(`https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    });
    return publicClient;
  } else {
    console.log("chain not available");
  }
};
