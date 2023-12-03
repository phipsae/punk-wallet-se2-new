import { PrivateKeyAccount } from "viem";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { Address } from "~~/components/scaffold-eth";
import { useSharedState } from "~~/sharedStateContext";

interface DeleteAccountProps {
  address: string;
  setSelectedAccount: (account: PrivateKeyAccount) => void;
}

export const DeleteAccount = ({ address, setSelectedAccount }: DeleteAccountProps) => {
  const { accounts, setAccounts } = useSharedState();

  const deleteAccount = (address: string) => {
    const filteredAccounts = accounts.filter(acc => acc.account.address !== address);
    setAccounts(filteredAccounts);
    console.log(filteredAccounts[0].account);
    setSelectedAccount(filteredAccounts[0].account);
  };
  return (
    <>
      <dialog id="delete_account" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex flex-row gap-2 justify-center">
            Delete Account <Address address={address} />?
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

          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-5">
                <div className="w-full">
                  <button
                    className="btn btn-error"
                    onClick={() => {
                      deleteAccount(address);
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
    </>
  );
};
