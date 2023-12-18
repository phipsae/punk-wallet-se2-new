import { useCallback, useEffect, useState } from "react";
import { DeleteAccount } from "./DeleteAccount";
import { ImportAccount } from "./ImportAccount";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { AddressAdapted } from "~~/components/scaffold-eth/AddressAdapted";
import { AddressPrivateKey } from "~~/components/scaffold-eth/AddressPrivateKey";
import { useSharedState } from "~~/sharedStateContext";

export const AccountSwitcher = () => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [isImportAccount, setIsImportAccount] = useState(false);
  // const [privateKeys, setPrivateKeys] = useState<string[]>([]);
  // const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>("");
  const { selectedPrivateKey, setSelectedPrivateKey } = useSharedState();
  const { privateKeys, setPrivateKeys } = useSharedState();

  const generateAccount = useCallback(() => {
    const newAccount = generatePrivateKey();
    const updatedPrivateKeys = [...privateKeys, newAccount];
    setPrivateKeys(updatedPrivateKeys);
    setSelectedPrivateKey(newAccount);
    if (typeof window !== "undefined") {
      localStorage.setItem("storedPrivateKeys", JSON.stringify(updatedPrivateKeys));
      localStorage.setItem("selectedPrivateKey", JSON.stringify(newAccount));
    }
    return newAccount;
  }, [privateKeys, setSelectedPrivateKey, setPrivateKeys]);

  const handleRowClick = (account: string) => {
    setSelectedPrivateKey(account);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedPrivateKey", JSON.stringify(account));
    }
  };

  const togglePrivateKey = () => {
    setShowPrivateKey(!showPrivateKey);
  };

  const toggleImportAccount = () => {
    setIsImportAccount(!isImportAccount);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKeys = localStorage.getItem("storedPrivateKeys");
      const storedPrivateKey = localStorage.getItem("selectedPrivateKey");

      try {
        const parsedStoredKeys = storedKeys ? JSON.parse(storedKeys) : [];
        const parsedStoredPrivateKey = storedPrivateKey ? JSON.parse(storedPrivateKey) : "";

        if (parsedStoredKeys.length === 0) {
          generateAccount();
        } else {
          // Update state only if different
          if (JSON.stringify(parsedStoredKeys) !== JSON.stringify(privateKeys)) {
            setPrivateKeys(parsedStoredKeys);
          }
        }

        if (parsedStoredPrivateKey && parsedStoredPrivateKey !== selectedPrivateKey) {
          setSelectedPrivateKey(parsedStoredPrivateKey);
        }

        // console.log("From Account Switcher", parsedStoredKeys);
        // if (parsedStoredKeys.length === 0) {
        //   generateAccount();
        // } else {
        //   // setPrivateKeys(parsedStoredKeys);
        // }
        // setSelectedPrivateKey(parsedStoredPrivateKey || selectedPrivateKey);
      } catch (error) {
        console.error("Error parsing stored keys: ", error);
      }
    }
  });

  useEffect(() => {
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
        id="account_switcher"
        className="z-1 modal fixed top-10 mx-auto left-0 right-0 overflow-y-auto max-h-[80vh]"
      >
        <div className="modal-box z-1">
          <div className="text-center mb-5">
            <span className="block text-2xl font-bold">💳 Accounts</span>
          </div>
          <div className="content-wrapper min-h-[480px] max-h-[480px] overflow-auto">
            {isImportAccount ? (
              <ImportAccount
                onClose={toggleImportAccount}
                privateKeys={privateKeys}
                setSelectedPrivateKey={setSelectedPrivateKey}
                setPrivateKeys={setPrivateKeys}
              />
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
