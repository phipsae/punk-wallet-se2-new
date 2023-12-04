import { useEffect } from "react";
import { ERC20TokenTransaction } from "./ERC20TokenTransaction";
import { NativeTokenTransaction } from "./NativeTokenTransaction";

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
  useEffect(() => {
    // Code to refresh the component data
  }, [refreshCount]); // Dependency on refreshCount

  return (
    <>
      {tokenAddress === "nativeToken" ? (
        <div>
          <NativeTokenTransaction selectedChain={networkName} account={account} />
        </div>
      ) : (
        <div>
          <ERC20TokenTransaction account={account} selectedChain={networkName} tokenAddress={tokenAddress} />
        </div>
      )}
    </>
  );
};
