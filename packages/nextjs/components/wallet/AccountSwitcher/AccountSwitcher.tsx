import { useCallback, useEffect, useState } from "react";
import { DeleteAccount } from "./DeleteAccount";
import { PrivateKeyAccount, generatePrivateKey, privateKeyToAccount } from "viem/accounts";
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

  const openModal = () => {
    const modal = document.getElementById("my_modal_2") as HTMLDialogElement | null;
    if (modal) {
      modal.showModal();
    } else {
      console.error("Modal element not found!");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full">
          {/* head */}
          <thead>
            <tr>
              <th>#</th>
              <th>Account</th>
              <th>Delete</th>
            </tr>
          </thead>
        </table>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <table className="table w-full ">
            <tbody>
              {/* row */}
              {accounts.map(account => (
                <tr
                  key={account.account.address}
                  className={`cursor-pointer ${
                    selectedAccount?.address === account.account.address ? "bg-gray-100 font-bold" : "bg-base-200"
                  }`}
                >
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={account.account.address === selectedAccount?.address}
                      onChange={() => handleRowClick(account.account, account.privateKey)}
                    />
                  </th>
                  <td>
                    {/* {account.account.address?.slice(0, 5) + "..." + account.account.address?.slice(-4)} */}
                    <AddressAdapted address={account.account.address} format="short" />
                  </td>
                  <td>
                    <button className="btn" onClick={() => openModal()}>
                      open modal
                    </button>
                    <DeleteAccount address={account.account.address} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-3 w-full"
        onClick={() => {
          generateAccount();
          console.log(accounts);
        }}
      >
        Generate new account
      </button>
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
          Private Key:
          <AddressPrivateKey address={revealedPrivateKey} />
        </div>
      )}
    </>
  );
};
