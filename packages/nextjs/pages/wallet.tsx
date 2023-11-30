import type { NextPage } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { TokenOverview } from "~~/components/wallet/TokenOverview/TokenOverview";
import { SelectedTokenTransaction } from "~~/components/wallet/Transaction/SelectedTokenTransaction";
import { WalletOverview } from "~~/components/wallet/WalletOverview/WalletOverview";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`);
  const { selectedChain, selectedTokenAddress, selectedTokenName, selectedTokenImage } = useSharedState();

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        <NetworkMenu />
        <div className="flex flex-row gap-5">
          <div className="flex flex-col flex-1 mt-5 border p-5">
            <WalletOverview
              account={account}
              chain={selectedChain}
              tokenAddress={selectedTokenAddress}
              tokenName={selectedTokenName}
              tokenImage={selectedTokenImage}
            />
            <SelectedTokenTransaction
              account={account}
              networkName={selectedChain}
              tokenAddress={selectedTokenAddress}
            />
          </div>
          <div className="flex flex-col flex-1 mt-5 border p-5 ">
            <div className="text-center mb-5">
              <span className="block text-2xl font-bold">💸 Token Overview</span>
            </div>
            <TokenOverview networkName={selectedChain} address={account.address} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
