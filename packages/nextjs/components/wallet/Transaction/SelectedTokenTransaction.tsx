import { useEffect } from "react";
import { ERC20TokenTransaction } from "./ERC20TokenTransaction";
import { NativeTokenTransaction } from "./NativeTokenTransaction";
import { WagmiERC20TokenTransaction } from "./WagmiERC20TokenTransaction";
import { WagmiNativeTransaction } from "./WagmiNativeTransaction";
import { useAccount } from "wagmi";

interface SelectedTokenTransactionProps {
  account: any;
  networkName: string;
  tokenAddress: string;
  refreshCount: number;
}

export const SelectedTokenTransaction = ({
  account,
  networkName,
  tokenAddress,
  refreshCount,
}: SelectedTokenTransactionProps) => {
  const { isConnected } = useAccount();
  useEffect(() => {
    // Code to refresh the component data
  }, [refreshCount]); // Dependency on refreshCount

  return (
    <>
      {tokenAddress === "nativeToken" ? (
        <div>
          {isConnected ? (
            <WagmiNativeTransaction />
          ) : (
            <NativeTokenTransaction selectedChain={networkName} account={account} />
          )}
        </div>
      ) : (
        <div>
          {isConnected ? (
            <WagmiERC20TokenTransaction tokenAddress={tokenAddress} />
          ) : (
            <ERC20TokenTransaction account={account} selectedChain={networkName} tokenAddress={tokenAddress} />
          )}
        </div>
      )}
    </>
  );
};
