// import Image from "next/image";
import { useEffect } from "react";
import { SignClientTypes } from "@walletconnect/types";

interface PairingModalProps {
  visible: boolean;
  setModalVisible: (arg: boolean) => void;
  currentProposal: SignClientTypes.EventArguments["session_proposal"] | undefined;
  handleAccept: () => void;
  handleReject: () => void;
}

// to get rid of the typescript errors
function isDialogElement(element: HTMLElement | null): element is HTMLDialogElement {
  return element !== null && "close" in element;
}

export const PairingModal = ({ visible, currentProposal, handleAccept, handleReject }: PairingModalProps) => {
  const name = currentProposal?.params?.proposer?.metadata?.name;
  const url = currentProposal?.params?.proposer?.metadata.url;
  const methods = currentProposal?.params?.requiredNamespaces.eip155.methods;
  const events = currentProposal?.params?.requiredNamespaces.eip155.events;
  const chains = currentProposal?.params?.requiredNamespaces.eip155.chains;
  // const icon = currentProposal?.params.proposer.metadata.icons[0];

  console.log("Current Proposal", currentProposal);

  useEffect(() => {
    console.log("Pairing Incoming");
    if (name) {
      const pairingModal = document.getElementById("pairing_modal");
      if (isDialogElement(pairingModal)) {
        pairingModal.showModal();
      }
    }
  }, [name]);

  return (
    <>
      <dialog id="pairing_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Connect with Dapp {name}</h3>
          <div>
            <p className="py-4">Config</p>
            {/* <Image src={icon || ""} alt="DApp Icon" width={50} height={50} /> */}
            {/* Icon URL: {icon} */}
            <br />
            Name: {name} {visible}
            <br />
            URL: {url}
            <br />
            Chains: {chains}
            <br />
            Methods:
            {methods?.map(method => (
              <div key={method}>{method}</div>
            ))}
            <br />
            Events:
            {events?.map(events => (
              <div key={events}>{events}</div>
            ))}
            <br />
            <div className="modal-action">
              <form method="dialog">
                {/* <button className="btn">Close</button> */}
                <button className="btn btn-error mt-3" onClick={() => handleReject()}>
                  Reject
                </button>
                <button className="btn btn-primary mt-3" onClick={() => handleAccept()}>
                  Accept
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};
