import { useEffect, useState } from "react";
import { getAccount } from "@wagmi/core";
import type { NextPage } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { TokenOverview } from "~~/components/wallet/TokenOverview/TokenOverview";
import { SelectedTokenTransaction } from "~~/components/wallet/Transaction/SelectedTokenTransaction";
import { WalletConnectDapp } from "~~/components/wallet/WalletConnect/WalletConnectDapp";
import { WalletOverview } from "~~/components/wallet/WalletOverview/WalletOverview";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const { selectedPrivateKey, isRainbow } = useSharedState();
  const { selectedChain, selectedTokenAddress, selectedTokenName, selectedTokenImage } = useSharedState();

  const [account, setAccount] = useState<any>(null);

  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const updateAccount = () => {
      if (isRainbow) {
        setAccount(getAccount());
      } else if (selectedPrivateKey !== "") {
        setAccount(privateKeyToAccount(selectedPrivateKey as `0x${string}`));
      } else {
        setAccount(privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`));
      }
    };

    updateAccount();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", updateAccount);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", updateAccount);
      }
    };
  }, [isRainbow, selectedPrivateKey]);

  const refreshComponents = () => {
    setRefreshCount(prevCount => prevCount + 1);
  };

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        <div className="flex flex-row gap-5 items-center">
          <div className="w-1/12">
            <NetworkMenu />
          </div>
          <div>
            <button onClick={refreshComponents} className="btn btn-primary">
              <ArrowPathIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <WalletConnectDapp />
        {/* <OGWalletConnect /> */}
        <div className="flex flex-row gap-5">
          {account && selectedPrivateKey && (
            <div className="flex flex-col flex-1 mt-5 border p-5">
              <WalletOverview
                account={account}
                chain={selectedChain}
                tokenAddress={selectedTokenAddress}
                tokenName={selectedTokenName}
                tokenImage={selectedTokenImage}
                refreshCount={refreshCount}
              />
              <SelectedTokenTransaction
                account={account}
                networkName={selectedChain}
                tokenAddress={selectedTokenAddress}
                refreshCount={refreshCount}
              />
            </div>
          )}
          <div className="flex flex-col flex-1 mt-5 border p-5 ">
            <div className="text-center mb-5">
              <span className="block text-2xl font-bold">💸 Token Overview</span>
            </div>
            {account && (
              <TokenOverview networkName={selectedChain} address={account.address} refreshCount={refreshCount} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
