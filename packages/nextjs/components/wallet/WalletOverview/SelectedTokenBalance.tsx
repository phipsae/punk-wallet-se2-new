import { ERC20TokenBalance } from "../TokenOverview/ERC20TokenBalance";
import { NativeTokenBalance } from "../TokenOverview/NativeTokenBalance";

interface SelectedTokenBalanceProps {
  address: string;
  networkName: string;
  tokenAddress: string;
  refreshCount: number;
}

export const SelectedTokenBalance = ({
  address,
  networkName,
  tokenAddress,
  refreshCount,
}: SelectedTokenBalanceProps) => {
  return (
    <>
      {tokenAddress === "nativeToken" ? (
        <div>
          <NativeTokenBalance address={address} networkName={networkName} refreshCount={refreshCount} />
        </div>
      ) : (
        <div>
          <ERC20TokenBalance
            address={address}
            networkName={networkName}
            tokenAddress={tokenAddress}
            refreshCount={refreshCount}
          />
        </div>
      )}
    </>
  );
};
