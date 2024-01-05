import { Fragment, useEffect, useState } from "react";
import { web3wallet } from "../utils/WalletConnectUtils";
import { getSdkError } from "@walletconnect/utils";

export const Pairings = () => {
  const [pairings, setPairings] = useState(web3wallet ? web3wallet.core.pairing.getPairings() : []);
  const [activeSession] = useState(web3wallet ? web3wallet.getActiveSessions() : []);

  async function onDelete(topic: string) {
    await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
    const newPairings = pairings.filter((pairing: any) => pairing.topic !== topic);
    setPairings(newPairings);
  }

  // Activate a previously created pairing (e.g. after the peer has paired), by providing the pairing topic.
  const acctivatePairing = async (topic: string) => {
    await web3wallet.core.pairing.activate({ topic: topic });
    console.log(topic);
    console.log(web3wallet);
    console.log("doesn't work?");
    await web3wallet.core.pairing.ping({ topic: topic });
  };

  useEffect(() => {
    setPairings(web3wallet ? web3wallet.core.pairing.getPairings() : []);
  }, [setPairings]);

  return (
    <Fragment>
      <h1> Pairings</h1>
      <button className="btn" onClick={() => console.log("Active Session", activeSession)}>
        Active Session
      </button>
      <button className="btn" onClick={() => console.log("Pairings", pairings)}>
        Pairings
      </button>
      <br />

      {pairings.length
        ? pairings.map((pairing: any) => {
            const { peerMetadata } = pairing;

            return (
              <div key={pairing}>
                ----
                <br />
                Topic: {pairing.topic}
                <br />
                logo={peerMetadata?.icons[0]}
                <br />
                url={peerMetadata?.url}
                <br />
                name={peerMetadata?.name}
                <br />
                <button className="btn btn-error" onClick={() => onDelete(pairing.topic)}>
                  Disconnect / onDelete
                </button>
                <button className="btn btn-success" onClick={() => acctivatePairing(pairing.topic)}>
                  Activate Pairing
                </button>
                <br />
                <button className="btn" onClick={() => console.log(peerMetadata)}>
                  Console log peerMetaData
                </button>
                <br />
                ----
              </div>
            );
          })
        : "No pairings"}
    </Fragment>
  );
};
