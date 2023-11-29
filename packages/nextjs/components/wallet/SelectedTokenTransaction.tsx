import { ERC20TokenTransaction } from "./ERC20TokenTransaction";
import { NativeTokenTransaction } from "./NativeTokenTransaction";

interface SelectedTokenTransactionProps {
  account: any;
  networkName: string;
  tokenAddress: string;
}

export const SelectedTokenTransaction = ({ account, networkName, tokenAddress }: SelectedTokenTransactionProps) => {
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
