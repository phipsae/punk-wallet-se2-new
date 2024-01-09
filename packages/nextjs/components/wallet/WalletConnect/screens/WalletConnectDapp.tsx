import { useCallback, useEffect, useState } from "react";
import { EIP155_SIGNING_METHODS } from "../utils/EIP155Lib";
import useInitialization, { web3WalletPair, web3wallet } from "../utils/WalletConnectUtils";
// import { getSupportedChainIds } from "../utils/WalletConnectUtils";
import { ConnectModal } from "./ConnectModal";
import { PairingModal } from "./PairingModal";
import { Pairings } from "./Pairings";
import { SignModal } from "./SignModal";
import { SignClientTypes } from "@walletconnect/types";
import { SessionTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";
// import { buildApprovedNamespaces } from "@walletconnect/utils";
// import { Web3WalletTypes } from "@walletconnect/web3wallet";
import { privateKeyToAccount } from "viem/accounts";
import { useSharedState } from "~~/sharedStateContext";

export const WalletConnectDapp = () => {
  useInitialization();
  // const { selectedChain } = useSharedState();
  const { selectedPrivateKey, selectedChain } = useSharedState();
  const [currentWCURI, setCurrentWCURI] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [currentProposal, setCurrentProposal] = useState();

  const [signModalVisible, setSignModalVisible] = useState(false);
  const [successfulSession, setSuccessfulSession] = useState(false);

  const [requestSession, setRequestSession] = useState();
  const [requestEventData, setRequestEventData] = useState();

  // const [proposalID, setProposalID] = useState<number | undefined>();

  let account: any;

  if (typeof window !== "undefined" && selectedPrivateKey != "") {
    account = privateKeyToAccount(selectedPrivateKey as `0x${string}`);
  }

  // Section: Pair with dapp via wcUri

  const pair = useCallback(async () => {
    const pairing = await web3WalletPair({
      uri: currentWCURI,
    });

    return pairing;
  }, [currentWCURI]);

  const onSessionProposal = useCallback((proposal: SignClientTypes.EventArguments["session_proposal"]) => {
    setModalVisible(true);
    // @ts-ignore
    setCurrentProposal(proposal);
  }, []);

  // // w approved Namespaces
  // let approvedNamespaces: any;

  // const onSessionProposal = useCallback(
  //   async (
  //     { id, params }: Web3WalletTypes.SessionProposal,
  //     address: any,

  //     // web3wallet: any,
  //   ) => {
  //     console.log("Params", params);
  //     console.log("id", id);
  //     try {
  //       // ------- namespaces builder util from ------------ //
  //       setProposalID(id);
  //       console.log("proposalID", proposalID);
  //       approvedNamespaces = buildApprovedNamespaces({
  //         proposal: params,
  //         supportedNamespaces: {
  //           eip155: {
  //             chains: getSupportedChainIds().map(chainId => "eip155:" + chainId), // ["eip155:1", "eip155:137", ...]
  //             methods: [
  //               "eth_sendTransaction",
  //               "eth_signTransaction",
  //               "eth_sign",
  //               "personal_sign",
  //               "eth_signTypedData",
  //               "eth_signTypedData_v4",
  //             ],
  //             events: ["accountsChanged", "chainChanged"],
  //             accounts: getSupportedChainIds().map(chainId => "eip155:" + chainId + ":" + address), // ["eip155:1:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", "eip155:137:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", ...]
  //           },
  //         },
  //       });
  //       // ------- end namespaces builder util ------------ //
  //     } catch (error) {
  //       console.error("Something is wrong with the namespaces", error);
  //       // setWalletConnectUrl("");
  //       // await web3wallet.rejectSession({
  //       //   id: id,
  //       //   reason: getSdkError("USER_REJECTED"),
  //       // });
  //     }
  //     setCurrentProposal(approvedNamespaces);
  //   },
  //   [],
  // );

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
    }
  }, [currentProposal]);

  // // Handle Accept with approved namespaces
  // const handleAccept = useCallback(async () => {
  //   console.log("ID", proposalID);
  //   if (currentProposal) {
  //     await web3wallet.approveSession({
  //       id: proposalID,
  //       namespaces: currentProposal,
  //     });
  //     setModalVisible(false);
  //     setCurrentWCURI("");
  //     setCurrentProposal(undefined);
  //     setSuccessfulSession(true);
  //   }
  // }, [currentProposal, proposalID]);

  // Handle Accept w/o approved namespaces
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
    // // w namespaces
    // web3wallet?.on("session_proposal", proposal => onSessionProposal(proposal, account.address));
    // // w/o namespaces
    web3wallet?.on("session_proposal", onSessionProposal);
    web3wallet?.on("session_request", onSessionRequest);
  }, [onSessionProposal, pair, handleAccept, handleReject, onSessionRequest]);

  return (
    <>
      <h1 className="text-center font-bold mt-5">Wallet Connect</h1>
      <button onClick={() => console.log(web3wallet)}> Web3Wallet</button>
      {web3wallet && <Pairings />}
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
          <ConnectModal setCurrentWCURI={setCurrentWCURI} currentWCURI={currentWCURI} pair={pair} />
          <PairingModal
            handleAccept={handleAccept}
            handleReject={handleReject}
            visible={modalVisible}
            setModalVisible={setModalVisible}
            currentProposal={currentProposal}
          />
        </div>
      )}
      -----
      {signModalVisible && requestEventData && requestSession && (
        <SignModal
          account={account}
          selectedChain={selectedChain}
          visible={signModalVisible}
          setModalVisible={setSignModalVisible}
          requestEvent={requestEventData}
          requestSession={requestSession}
        />
      )}
      -----
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
