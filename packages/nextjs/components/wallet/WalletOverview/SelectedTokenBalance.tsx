import { ERC20TokenBalance } from "../TokenOverview/ERC20TokenBalance";
import { NativeTokenBalance } from "../TokenOverview/NativeTokenBalance";

interface SelectedTokenBalanceProps {
  address: string;
  networkName: string;
  tokenAddress: string;
}

export const SelectedTokenBalance = ({ address, networkName, tokenAddress }: SelectedTokenBalanceProps) => {
  return (
    <>
      {tokenAddress === "nativeToken" ? (
        <div>
          <NativeTokenBalance address={address} networkName={networkName} />
        </div>
      ) : (
        <div>
          <ERC20TokenBalance address={address} networkName={networkName} tokenAddress={tokenAddress} />
        </div>
      )}
    </>
  );
};
