import { useEffect, useState } from "react";
import { approvedNamespaces, createWeb3wallet, onSessionProposal } from "./OGWCHelpers";
// import PairingsPage from "./utils/pairings";
import { getSdkError } from "@walletconnect/utils";
// import { privateKeyToAccount } from "viem/accounts";
import { useAccount } from "wagmi";

// import { useSharedState } from "~~/sharedStateContext";

export const WalletConnectDapp = () => {
  // const { selectedChain } = useSharedState();
  const { address } = useAccount();
  const [walletConnectUri, setWalletConnectUri] = useState("");
  const [web3wallet, setWeb3wallet] = useState<any>();

  // const [wallectConnectConnector, setWallectConnectConnector] = useState();
  const [setWalletConnectConnected] = useState<boolean>();
  // const [walletConnectPeerMeta, setWalletConnectPeerMeta] = useState();

  // Initializes wallet connect wallet

  const initWeb3wallet = async () => {
    const web3wallet = await createWeb3wallet();

    web3wallet.on("session_proposal", proposal => {
      onSessionProposal(
        web3wallet,
        address,
        proposal,
        setWalletConnectUri,
        setWalletConnectConnected,
        // setWalletConnectPeerMeta,
        // disconnectFromWalletConnect,
      );
    });
    setWeb3wallet(web3wallet);
  };

  // Pair with dapp via wcUri

  const [session1, setSession1] = useState();

  const pairFunction = async () => {
    web3wallet.on("session_proposal", async (proposal: any) => {
      const session = await web3wallet.approveSession({
        id: proposal.id,
        namespaces: approvedNamespaces,
      });
      console.log("SESSSION", session);
      setSession1(session);
    });

    // web3wallet.on("session_proposal", onSessionProposal);
    await web3wallet.core.pairing.pair({ uri: walletConnectUri });
    console.log("connected");
  };

  const acctivatePairing = async (topic: string) => {
    await web3wallet.core.pairing.activate({ topic: topic });
  };

  // disconnect from the session

  const disconnectWalletConnect = async () => {
    const topics = Object.keys(web3wallet.getActiveSessions());
    // await web3wallet.disconnectSession({ , reason: getSdkError("USER_DISCONNECTED") });
    for (const topic of topics) {
      // eslint-disable-next-line @typescript-eslint/no-inferrable-types
      console.log("Disconnecting from session ", topic);
      await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
    }
  };

  const rejectFunction = async () => {
    web3wallet.on("session_proposal", async (proposal: any) => {
      await web3wallet.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
      console.log("rejected");
    });
  };

  // others

  const pingFunction = async () => {
    await web3wallet.core.pairing.ping({ topic: "438c0d95f21cd842c2da3a596bdd560fa1b6e308f59c24b15a0f9de0a6eb4c35" });
  };

  useEffect(() => {
    if (!web3wallet) {
      initWeb3wallet();
    }
    if (web3wallet) {
      web3wallet.on("session_request", async (requestEvent: any) => {
        console.log("session_request requestEvent", requestEvent);
        // const { params } = requestEvent;
        // console.log(params);

        // WalletConnectTransactionPopUp(requestEvent, userProvider, undefined, web3wallet, targetNetwork.chainId);
      });
      web3wallet.core.pairing.events.on("pairing_delete", ({ id, topic }: any) => {
        // clean up after the pairing for `topic` was deleted.
        console.log("in Events pairing deleted", id, topic);
      });
    }
  });

  // pairings listing
  const [pairings, setPairings] = useState(web3wallet ? web3wallet.core.pairing.getPairings() : []);

  async function onDelete(topic: string) {
    await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
    const newPairings = pairings.filter((pairing: any) => pairing.topic !== topic);
    setPairings(newPairings);
  }

  return (
    <>
      <h1 className="text-center font-bold mt-5">Wallet Connect</h1>
      <button onClick={() => console.log(web3wallet)}>Wallet</button>
      <button onClick={() => console.log(walletConnectUri)}>Uri</button>
      <button onClick={() => disconnectWalletConnect()}>Disconnect</button>
      <button onClick={() => console.log(rejectFunction())}>Reject</button>
      <button onClick={() => console.log(onSessionProposal, approvedNamespaces)}>namespaces</button>
      <button onClick={() => console.log(session1)}>SessionObject</button>
      <button onClick={() => console.log(Object.keys(web3wallet.getActiveSessions()))}>Active Sessions</button>
      <button onClick={() => console.log(web3wallet.core.pairing.getPairings())}>Pairings</button>
      <button onClick={() => console.log(pingFunction())}>Ping</button>
      <button onClick={() => console.log(setPairings(web3wallet.core.pairing.getPairings()))}>Set Pairings</button>
      <button onClick={() => console.log(pairings)}>Pairings from set</button>

      {pairings &&
        pairings.map((pairing: any, index: any) => {
          return (
            <div key={index}>
              <h2>{pairing.topic}</h2>
              <button onClick={() => onDelete(pairing.topic)}> Delete</button>
              <button onClick={() => acctivatePairing(pairing.topic)}> Activate Pairing</button>
            </div>
          );
        })}
      <form>
        <input
          onChange={e => setWalletConnectUri(e.target.value)}
          value={walletConnectUri}
          placeholder="Enter WC URI (wc:1234...)"
        />

        <button onClick={() => pairFunction()} title="Pair Session" type="button">
          PAIR Session
        </button>
      </form>
    </>
  );
};
