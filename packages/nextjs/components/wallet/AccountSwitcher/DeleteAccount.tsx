import { useSharedState } from "~~/sharedStateContext";

interface DeleteAccountProps {
  address: string;
}

export const DeleteAccount = ({ address }: DeleteAccountProps) => {
  const { accounts, setAccounts } = useSharedState();

  const deleteAccount = (address: string) => {
    const filteredAccounts = accounts.filter(acc => acc.account.address !== address);
    setAccounts(filteredAccounts);
  };
  return (
    <>
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              <button
                className="btn btn-error"
                onClick={() => {
                  deleteAccount(address);
                }}
              >
                Delete
              </button>

              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};
