import { useCallback, useEffect, useState } from "react";
import { DeleteAccount } from "./DeleteAccount";
import { ImportAccount } from "./ImportAccount";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { AddressAdapted } from "~~/components/scaffold-eth/AddressAdapted";
import { AddressPrivateKey } from "~~/components/scaffold-eth/AddressPrivateKey";

export const AccountSwitcher = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isImportAccount, setIsImportAccount] = useState(false);
  const [privateKeys, setPrivateKeys] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const storedKeys = localStorage.getItem("storedPrivateKeys");
      try {
        return storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error("Error parsing stored private keys: ", error);
        return [];
      }
    }
    return [];
  });
  const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const storedPrivateKey = localStorage.getItem("storedPrivateKey");
      try {
        return storedPrivateKey ? JSON.parse(storedPrivateKey) : [];
      } catch (error) {
        console.error("Error parsing stored private keys: ", error);
        return [];
      }
    }
    return [];
  });

  const generateAccount = useCallback(() => {
    const newAccount = generatePrivateKey();
    const updatedPrivateKeys = [...privateKeys, newAccount];
    setPrivateKeys(updatedPrivateKeys);
    localStorage.setItem("storedPrivateKeys", JSON.stringify(updatedPrivateKeys));
    return newAccount;
  }, [privateKeys]);

  const handleRowClick = (account: string) => {
    setSelectedPrivateKey(account);
    localStorage.setItem("storedPrivateKey", JSON.stringify(account));
  };

  const togglePrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const toggleImportAccount = () => {
    setIsImportAccount(!isImportAccount);
  };

  useEffect(() => {
    if (privateKeys.length === 0) {
      // Generate the initial account

      const initialAccount = generateAccount();
      // Set the initial account as the selected account
      setSelectedPrivateKey(initialAccount);
      localStorage.setItem("selectedPrivateKey", JSON.stringify(initialAccount));

      // Set the private key of the initial account
      // setRevealedPrivateKey(initialPrivateKey);
    }
  }, [generateAccount, privateKeys]); // Dependency array includes 'accounts'

  useEffect(() => {
    // Set 'showPrivateKey' to false whenever 'selectedAccount' changes
    setShowPrivateKey(false);
  }, [selectedPrivateKey]);

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
        id="account_switcher_2"
        className="z-1 modal fixed top-10 mx-auto left-0 right-0 overflow-y-auto max-h-[80vh]"
      >
        <div className="modal-box z-1">
          <div className="text-center mb-5">
            <span className="block text-2xl font-bold">💳 Accounts2222</span>
          </div>
          <button
            onClick={() => {
              console.log("privateKey from Button", selectedPrivateKey);
            }}
          >
            {" "}
            Click Me{" "}
          </button>
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
                        {selectedPrivateKey &&
                          privateKeys &&
                          privateKeys.map((privateKey, index) => (
                            <tr
                              key={index}
                              className={`cursor-pointer ${
                                privateKey === selectedPrivateKey ? "bg-gray-100 font-bold" : "bg-base-200"
                              }`}
                            >
                              <th className="w-1/5">
                                <input
                                  type="checkbox"
                                  className="checkbox"
                                  checked={privateKey === selectedPrivateKey}
                                  onChange={() => handleRowClick(privateKey)}
                                />
                              </th>
                              <td className="w-3/5">
                                <AddressAdapted
                                  address={privateKeyToAccount(privateKey as `0x${string}`).address}
                                  format="short"
                                />
                              </td>
                              <td className="flex justify-start items-center w-1/5">
                                {selectedPrivateKey === privateKey && (
                                  <>
                                    <button className="btn" onClick={() => openModal("delete_account")}>
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                    <DeleteAccount
                                      privateKey={selectedPrivateKey}
                                      privateKeys={privateKeys}
                                      setPrivateKeys={setPrivateKeys}
                                      setSelectedPrivateKey={setSelectedPrivateKey}
                                    />
                                  </>
                                )}
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
                    }}
                  >
                    Import Account
                  </button>
                  <button
                    className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-3 flex-1"
                    onClick={() => {
                      generateAccount();
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
                    <AddressPrivateKey address={selectedPrivateKey} />
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
