import Image from "next/image";
import { SignClientTypes } from "@walletconnect/types";

interface PairingModalProps {
  visible: boolean;
  setModalVisible: (arg1: boolean) => void;
  currentProposal: SignClientTypes.EventArguments["session_proposal"] | undefined;
  handleAccept: () => void;
  handleReject: () => void;
}

export default function PairingModal({ visible, currentProposal, handleAccept, handleReject }: PairingModalProps) {
  const name = currentProposal?.params?.proposer?.metadata?.name;
  const url = currentProposal?.params?.proposer?.metadata.url;
  const methods = currentProposal?.params?.requiredNamespaces.eip155.methods;
  const events = currentProposal?.params?.requiredNamespaces.eip155.events;
  const chains = currentProposal?.params?.requiredNamespaces.eip155.chains;
  const icon = currentProposal?.params.proposer.metadata.icons[0];

  return (
    <>
      <h1> Pairing Modal</h1>
      <Image src={icon || ""} alt="DApp Icon" width={50} height={50} />
      Icon URL: {icon}
      <br />
      Name: {name} {visible}
      <br />
      URL: {url}
      <br />
      Chains: {chains}
      <br />
      Methods:{" "}
      {methods?.map(method => {
        <div key={method}>{method}</div>;
      })}
      <br />
      Events:{" "}
      {events?.map(events => (
        <div key={events}>{events}</div>
      ))}
      <br />
      <button className="btn btn-primary mt-3" onClick={() => handleAccept()}>
        Accept
      </button>
      <br />
      <button className="btn btn-error mt-3" onClick={() => handleReject()}>
        Reject
      </button>
      <h1> ------ </h1>
    </>
  );
}
