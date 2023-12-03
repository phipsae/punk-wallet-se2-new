import { useCallback, useEffect, useState } from "react";
import { DeleteAccount } from "./DeleteAccount";
import { ImportAccount } from "./ImportAccount";
import { PrivateKeyAccount, generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { AddressAdapted } from "~~/components/scaffold-eth/AddressAdapted";
import { AddressPrivateKey } from "~~/components/scaffold-eth/AddressPrivateKey";
import { useSharedState } from "~~/sharedStateContext";

interface AccountWithPrivateKey {
  account: PrivateKeyAccount;
  privateKey: string;
}

export const AccountSwitcher = () => {
  //   const [accounts, setAccounts] = useState<AccountWithPrivateKey[]>([]);
  //   const [selectedAccount, setSelectedAccount] = useState<PrivateKeyAccount>();
  const { accounts, setAccounts, selectedAccount, setSelectedAccount } = useSharedState();
  const [revealedPrivateKey, setRevealedPrivateKey] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isImportAccount, setIsImportAccount] = useState(false);

  const generateAccount = useCallback(() => {
    const privateKey = generatePrivateKey();
    const newAccount = privateKeyToAccount(privateKey);

    const newAccountWithKey: AccountWithPrivateKey = {
      account: newAccount,
      privateKey: privateKey,
    };
    setAccounts([...accounts, newAccountWithKey]);
    return newAccountWithKey;
  }, [accounts, setAccounts]);

  const handleRowClick = (account: PrivateKeyAccount, privateKey: string) => {
    setSelectedAccount(account);
    setRevealedPrivateKey(privateKey);
    console.log("selected Account", selectedAccount);
  };

  const togglePrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const toggleImportAccount = () => {
    setIsImportAccount(!isImportAccount);
  };

  useEffect(() => {
    if (accounts.length === 0) {
      // Generate the initial account
      const initialAccount = generateAccount();

      // Set the initial account as the selected account
      setSelectedAccount(initialAccount.account);

      // Set the private key of the initial account
      setRevealedPrivateKey(initialAccount.privateKey);
    }
  }, [accounts, generateAccount, setSelectedAccount]); // Dependency array includes 'accounts'

  useEffect(() => {
    // Set 'showPrivateKey' to false whenever 'selectedAccount' changes
    setShowPrivateKey(false);
  }, [selectedAccount]);

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
      <dialog
        id="account_switcher"
        className="z-1 modal fixed top-10 mx-auto left-0 right-0 overflow-y-auto max-h-[80vh]"
      >
        <div className="modal-box z-1">
          <div className="text-center mb-5">
            <span className="block text-2xl font-bold">💳 Accounts</span>
          </div>
          <div className="content-wrapper min-h-[480px] max-h-[480px] overflow-auto">
            {isImportAccount ? (
              <ImportAccount onClose={toggleImportAccount} />
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    {/* head */}
                    <thead>
                      <tr>
                        <th className="w-1/5">Select</th>
                        <th className="w-3/5">Account</th>
                        <th className="w-1/5">Delete</th>
                      </tr>
                    </thead>
                  </table>
                  <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                    <table className="table w-full ">
                      <tbody>
                        {/* row */}
                        {accounts.map(account => (
                          <tr
                            key={account.account.address}
                            className={`cursor-pointer ${
                              selectedAccount?.address === account.account.address
                                ? "bg-gray-100 font-bold"
                                : "bg-base-200"
                            }`}
                          >
                            <th className="w-1/5">
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={account.account.address === selectedAccount?.address}
                                onChange={() => handleRowClick(account.account, account.privateKey)}
                              />
                            </th>
                            <td className="w-3/5">
                              <AddressAdapted address={account.account.address} format="short" />
                            </td>
                            <td className="flex justify-start items-center w-1/5">
                              {selectedAccount?.address === account.account.address && (
                                <button className="btn" onClick={() => openModal("delete_account")}>
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              )}
                              <DeleteAccount
                                address={account.account.address}
                                setSelectedAccount={setSelectedAccount}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-5 w-full">
                  <button
                    className="btn btn-neutral h-[2.2rem] min-h-[2.2rem] mt-3 flex-1"
                    onClick={() => {
                      toggleImportAccount();
                      console.log(accounts);
                    }}
                  >
                    Import Account
                  </button>
                  <button
                    className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-3 flex-1"
                    onClick={() => {
                      generateAccount();
                      console.log(accounts);
                    }}
                  >
                    Generate new account
                  </button>
                </div>
                {/* Private Key */}
                <button
                  className="btn btn-error h-[2.2rem] min-h-[2.2rem] w-full mt-3"
                  onClick={() => {
                    togglePrivateKey();
                  }}
                >
                  {showPrivateKey ? "Hide private key" : "Reveal private key"}
                </button>
                {showPrivateKey && (
                  <div className="flex flex-row justify-center mt-5">
                    Private Key is:
                    <AddressPrivateKey address={revealedPrivateKey} />
                  </div>
                )}
                <div className="py-4">
                  <div className="flex flex-row items-start gap-5">
                    <div>
                      <ExclamationTriangleIcon className="h-20 w-20 text-start" />
                    </div>
                    <div>
                      <span className="font-bold">
                        Warning: Never disclose your private key. Anyone with your private keys can steal any assets
                        held in your account.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
