import { Fragment, useState } from "react";
import PairingCard from "./PairingCard";
// import PageHeader from "@/components/PageHeader";
// import { web3walle;
// import { Text } from "@nextui-org/react";
import { getSdkError } from "@walletconnect/utils";

export default function PairingsPage(web3wallet: any) {
  const [pairings, setPairings] = useState(web3wallet.core.pairing.getPairings());

  async function onDelete(topic: string) {
    await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
    const newPairings = pairings.filter((pairing: any) => pairing.topic !== topic);
    setPairings(newPairings);
  }

  return (
    <Fragment>
      {/* <PageHeader title="Pairings" /> */}
      {pairings.length
        ? pairings.map((pairing: any) => {
            const { peerMetadata } = pairing;

            return (
              <PairingCard
                key={pairing.topic}
                logo={peerMetadata?.icons[0]}
                url={peerMetadata?.url}
                name={peerMetadata?.name}
                topic={pairing.topic}
                onDelete={() => onDelete(pairing.topic)}
                data-testid={"pairing-" + pairing.topic}
              />
            );
          })
        : "No pairings"}
    </Fragment>
  );
}
