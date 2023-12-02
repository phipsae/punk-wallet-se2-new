import type { NextPage } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { AccountSwitcher } from "~~/components/wallet/AccountSwitcher/AccountSwitcher";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { TokenOverview } from "~~/components/wallet/TokenOverview/TokenOverview";
import { SelectedTokenTransaction } from "~~/components/wallet/Transaction/SelectedTokenTransaction";
import { WalletOverview } from "~~/components/wallet/WalletOverview/WalletOverview";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`);
  const { selectedChain, selectedTokenAddress, selectedTokenName, selectedTokenImage, selectedAccount } =
    useSharedState();

  const openModal = (modalName: string) => {
    const modal = document.getElementById(modalName) as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal element not found!");
    }
  };

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        <button className="btn" onClick={() => openModal("account_switcher")}>
          open modal
        </button>
        <dialog id="account_switcher" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              <AccountSwitcher />
            </h3>
            <div className="py-4">
              <div className="flex flex-row items-start gap-5">
                <div>
                  <ExclamationTriangleIcon className="h-20 w-20 text-start" />
                </div>
                <div>
                  <span className="font-bold">
                    Warning: Never disclose your private key. Anyone with your private keys can steal any assets held in
                    your account.
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>

        <NetworkMenu />
        <div className="flex flex-row gap-5">
          {selectedAccount && (
            <div className="flex flex-col flex-1 mt-5 border p-5">
              <WalletOverview
                account={selectedAccount}
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
          )}
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
