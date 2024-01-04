import { useCallback, useEffect, useState } from "react";
import { EIP155_SIGNING_METHODS } from "../utils/EIP155Lib";
import useInitialization, { // approvedNamespaces,
  // core,
  // onSessionProposal,
  web3WalletPair,
  web3wallet,
} from "../utils/WalletConnectUtils";
import PairingModal from "./PairingModal";
import { SignModal } from "./SignModal";
import { SessionTypes, SignClientTypes } from "@walletconnect/types";
// import PairingsPage from "./utils/pairings";
import { getSdkError } from "@walletconnect/utils";
// import { fromHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { useSharedState } from "~~/sharedStateContext";

export const WalletConnectDapp = () => {
  useInitialization();
  // const { selectedChain } = useSharedState();
  const { selectedPrivateKey, selectedChain } = useSharedState();
  const [currentWCURI, setCurrentWCURI] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProposal, setCurrentProposal] = useState();
  const [isPaired, setIsPaired] = useState(false);
  const [signModalVisible, setSignModalVisible] = useState(false);
  const [successfulSession, setSuccessfulSession] = useState(false);

  const [requestSession, setRequestSession] = useState();
  const [requestEventData, setRequestEventData] = useState();

  let account: any;

  if (typeof window !== "undefined" && selectedPrivateKey != "") {
    account = privateKeyToAccount(selectedPrivateKey as `0x${string}`);
  }

  // Section: Pair with dapp via wcUri

  const pair = useCallback(async () => {
    const pairing = await web3WalletPair({
      uri: currentWCURI,
    });
    setIsPaired(true);
    return pairing;
  }, [currentWCURI]);

  const onSessionProposal = useCallback((proposal: SignClientTypes.EventArguments["session_proposal"]) => {
    setModalVisible(true);
    // @ts-ignore
    setCurrentProposal(proposal);
  }, []);

  // const acctivatePairing = async (topic: string) => {
  //   await web3wallet.core.pairing.activate({ topic: topic });
  // };

  // Session: disconnect from the session, delete Pairings

  // // pairings listing
  // const [pairings, setPairings] = useState(web3wallet ? web3wallet.core.pairing.getPairings() : []);

  // async function onDelete(topic: string) {
  //   await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
  //   const newPairings = pairings.filter((pairing: any) => pairing.topic !== topic);
  //   setPairings(newPairings);
  // }

  const handleReject = useCallback(async () => {
    if (currentProposal) {
      const { id } = currentProposal;
      await web3wallet.rejectSession({
        id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });

      setModalVisible(false);
      setCurrentWCURI("");
      setCurrentProposal(undefined);
      setIsPaired(false);
    }
  }, [currentProposal]);

  const handleAccept = useCallback(async () => {
    // @ts-ignore
    const { id, params } = currentProposal;
    const { requiredNamespaces, relays } = params;

    if (currentProposal) {
      const namespaces: SessionTypes.Namespaces = {};
      Object.keys(requiredNamespaces).forEach(key => {
        const accounts: string[] = [];
        requiredNamespaces[key].chains.map((chain: any) => {
          [account.address].map(acc => accounts.push(`${chain}:${acc}`));
        });

        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        };
      });

      await web3wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });
      setModalVisible(false);
      setCurrentWCURI("");
      setCurrentProposal(undefined);
      setSuccessfulSession(true);
      setIsPaired(false);
    }
  }, [currentProposal, account]);

  async function disconnect() {
    const activeSessions = web3wallet.getActiveSessions();
    const topic = Object.values(activeSessions)[0].topic;
    console.log(activeSessions);

    if (activeSessions) {
      await web3wallet.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
    setSuccessfulSession(false);
  }

  const onSessionRequest = useCallback(async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
    const { topic, params } = requestEvent;
    const { request } = params;
    const requestSessionData = web3wallet.engine.signClient.session.get(topic);
    console.log("Request from onSessionRequest WCDAPP", requestEvent);
    console.log("requestSessionData from onSessionRequest WCDAPP", requestSessionData);

    if (requestEvent && requestSessionData) {
      switch (request.method) {
        // case EIP155_SIGNING_METHODS.ETH_SIGN:
        // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
        // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
        // case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
          console.log("HUHU");
        // case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
          // @ts-ignore
          setRequestSession(requestSessionData);
          // @ts-ignore
          setRequestEventData(requestEvent);
          setSignModalVisible(true);
          return;
      }
    }
  }, []);

  useEffect(() => {
    web3wallet?.on("session_proposal", onSessionProposal);
    web3wallet?.on("session_request", onSessionRequest);
  }, [onSessionProposal, pair, handleAccept, handleReject, onSessionRequest]);

  return (
    <>
      <h1 className="text-center font-bold mt-5">Wallet Connect</h1>
      {successfulSession && (
        <div>
          Successful connect to ...
          <button className="btn btn-primary" onClick={() => disconnect()} title="Disconnect" type="button">
            Disconnect
          </button>
        </div>
      )}
      {!successfulSession && (
        <div>
          {/* @ts-ignore */}
          <button className="btn" onClick={() => document.getElementById("wallet_connect").showModal()}>
            Connect to Wallet Connect LOGO
          </button>
          <dialog id="wallet_connect" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Connect with Wallet Connect</h3>
              {!isPaired && (
                <div>
                  <p className="py-4">Enter the wallet connect uri</p>
                  <div className="modal-action">
                    <form method="dialog">
                      <input
                        onChange={e => setCurrentWCURI(e.target.value)}
                        value={currentWCURI}
                        placeholder="Enter WC URI (wc:1234...)"
                      />
                      <br />
                      <button className="btn btn-primary" onClick={() => pair()} title="Pair Session" type="button">
                        Connect
                      </button>
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              )}
              {isPaired && (
                <PairingModal
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  visible={modalVisible}
                  setModalVisible={setModalVisible}
                  currentProposal={currentProposal}
                />
              )}
            </div>
          </dialog>
        </div>
      )}
      -----
      <SignModal
        account={account}
        selectedChain={selectedChain}
        visible={signModalVisible}
        setModalVisible={setSignModalVisible}
        requestEvent={requestEventData}
        requestSession={requestSession}
      />
      -----
      {/* <button onClick={() => disconnectWalletConnect()}>Disconnect</button> */}
      {/* <button onClick={() => console.log(rejectFunction())}>Reject</button> */}
      {/* <button onClick={() => console.log(web3wallet.core.pairing.getPairings())}>Pairings</button> */}
      {/* <button onClick={() => console.log(setPairings(web3wallet.core.pairing.getPairings()))}>Set Pairings</button> */}
      {/* <button onClick={() => console.log(pairings)}>Pairings from set</button> */}
      {/* <button onClick={() => handleRequest()}>HandleRequest</button> */}
      {/* {pairings &&
        pairings.map((pairing: any, index: any) => {
          return (
            <div key={index}>
              <h2>{pairing.topic}</h2>
              <button onClick={() => onDelete(pairing.topic)}> Delete</button>
              <button onClick={() => acctivatePairing(pairing.topic)}> Activate Pairing</button>
            </div>
          );
        })} */}
    </>
  );
};
