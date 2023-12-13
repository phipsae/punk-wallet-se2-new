import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { TokenOverview } from "~~/components/wallet/TokenOverview/TokenOverview";
import { SelectedTokenTransaction } from "~~/components/wallet/Transaction/SelectedTokenTransaction";
import { WalletOverview } from "~~/components/wallet/WalletOverview/WalletOverview";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrivateKey = localStorage.getItem("storedPrivateKey");
      try {
        setSelectedPrivateKey(storedPrivateKey ? JSON.parse(storedPrivateKey) : "");
      } catch (error) {
        console.error("Error parsing stored keys: ", error);
      }
    }
  }, []);
  // const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`);
  let account;

  if (selectedPrivateKey) {
    account = privateKeyToAccount(selectedPrivateKey as `0x${string}`);
  }
  const { selectedChain, selectedTokenAddress, selectedTokenName, selectedTokenImage } = useSharedState();

  const [refreshCount, setRefreshCount] = useState(0);

  const refreshComponents = () => {
    setRefreshCount(prevCount => prevCount + 1);
  };

  return (
    <>
      <button
        onClick={() => {
          console.log(selectedPrivateKey);
        }}
      >
        {" "}
        Click Me
      </button>
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
        <div className="flex flex-row gap-5">
          {account && (
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
