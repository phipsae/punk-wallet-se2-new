import { privateKeyToAccount } from "viem/accounts";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Address } from "~~/components/scaffold-eth";

interface DeleteAccountProps {
  privateKey: string;
  privateKeys: string[];
  setSelectedPrivateKey: (selectedPrivateKey: string) => void;
  setPrivateKeys: (privateKeys: string[]) => void;
}

export const DeleteAccount = ({
  privateKey,
  privateKeys,
  setPrivateKeys,
  setSelectedPrivateKey,
}: DeleteAccountProps) => {
  const deleteAccount = (privateKey: string) => {
    const filteredAccounts = privateKeys.filter(acc => acc !== privateKey);
    setPrivateKeys(filteredAccounts);
    localStorage.setItem("storedPrivateKeys", JSON.stringify(filteredAccounts));
    setSelectedPrivateKey(privateKeys[0]);
    localStorage.setItem("storedPrivateKey", JSON.stringify(privateKeys[0]));
  };

  return (
    <>
      {privateKey && privateKeys && (
        <dialog id="delete_account" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex flex-row gap-2 justify-center">
              Delete Account <Address address={privateKeyToAccount(privateKey as `0x${string}`).address} />?
            </h3>
            <div className="flex flex-row items-start gap-5 py-4">
              <div>
                <ExclamationCircleIcon className="h-20 w-20 text-start" />
              </div>
              <div>
                <span className="font-bold">
                  Warning: If you delete your account there is no way to revert it. So make sure your private key is
                  securely saved.
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                console.log("privateKey from Button", privateKeys);
              }}
            >
              {" "}
              Click Me{" "}
            </button>

            <div className="modal-action">
              <form method="dialog">
                <div className="flex flex-row gap-5">
                  <div className="w-full">
                    <button
                      className="btn btn-error"
                      onClick={() => {
                        deleteAccount(privateKey);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div>
                    <button className="btn"> Close </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};
