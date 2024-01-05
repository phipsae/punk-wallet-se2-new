import { Pairings } from "./Pairings";

interface ConnectModalProps {
  currentWCURI: string;
  setCurrentWCURI: (arg: string) => void;
  pair: () => void;
}

// to get rid of the typescript errors
function isDialogElement(element: HTMLElement | null): element is HTMLDialogElement {
  return element !== null && "close" in element;
}

export const ConnectModal = ({ setCurrentWCURI, currentWCURI, pair }: ConnectModalProps) => {
  const pairOpenModal = () => {
    pair();
    const walletConnectModal = document.getElementById("wallet_connect");
    const pairingModal = document.getElementById("pairing_modal");

    if (isDialogElement(walletConnectModal)) {
      walletConnectModal.close();
    }
    if (isDialogElement(pairingModal)) {
      pairingModal.showModal();
    }
  };

  return (
    <dialog id="wallet_connect" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Connect with Wallet Connect</h3>
        <div>
          <Pairings />
          <p className="py-4">Enter the wallet connect uri</p>
          <div className="modal-action">
            <form method="dialog">
              <input
                onChange={e => setCurrentWCURI(e.target.value)}
                value={currentWCURI}
                placeholder="Enter WC URI (wc:1234...)"
              />
              <br />
              <button
                className="btn btn-primary"
                onClick={() => {
                  pairOpenModal();
                }}
                title="Pair Session"
                type="button"
              >
                Connect
              </button>
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
};
