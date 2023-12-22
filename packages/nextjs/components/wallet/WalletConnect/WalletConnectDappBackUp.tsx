// import { useCallback, useEffect, useState } from "react";
// // import {
// //   approvedNamespaces,
// //   connectWalletConnectV2,
// //   createWeb3Wallet,
// //   isWalletConnectV2Connected,
// //   onSessionProposal,
// //   web3wallet,
// // } from "./utils/WalletConnectUtils";
// import { approvedNamespaces, createWeb3wallet, onSessionProposal, onSessionProposalTest } from "../OGWCHelpers";
// import WalletConnect from "@walletconnect/client";
// import { getSdkError } from "@walletconnect/utils";
// import { privateKeyToAccount } from "viem/accounts";
// import { useAccount } from "wagmi";
// import { useSharedState } from "~~/sharedStateContext";

// export const WalletConnectDappBackUp = () => {
//   // ETHEREUM Wallet connect react app
//   const { selectedPrivateKey, selectedChain } = useSharedState();
//   const { address } = useAccount();
//   const localChainId = 1;
//   const [walletConnectUri, setWalletConnectUri] = useState("");
//   const [web3wallet, setWeb3wallet] = useState<any>();

//   const [account, setAccount] = useState<any>(null);
//   const [wallectConnectConnector, setWallectConnectConnector] = useState();
//   const [web3walletNew, setWeb3walletNew] = useState();

//   const [walletConnectConnected, setWalletConnectConnected] = useState<boolean>();

//   const [walletConnectPeerMeta, setWalletConnectPeerMeta] = useState();
//   const [wallectConnectConnectorSession, setWallectConnectConnectorSession] = useState<any>();
//   let connector: any;

//   const connectWallet = (sessionDetails: any) => {
//     console.log(" 📡 Connecting to Wallet Connect....", sessionDetails);

//     try {
//       connector = new WalletConnect(sessionDetails);

//       const { peerMeta } = connector;
//       if (peerMeta) {
//         setWalletConnectPeerMeta(peerMeta);
//       }
//     } catch (error) {
//       console.error("Coudn't connect to", sessionDetails, error);
//       // localStorage.removeItem("walletConnectUri");
//       return;
//     }

//     setWallectConnectConnector(connector);

//     // Subscribe to session requests
//     connector.on("session_request", (error: any, payload: any) => {
//       if (error) {
//         throw error;
//       }

//       console.log("SESSION REQUEST");
//       // Handle Session Request

//       connector.approveSession({
//         accounts: [
//           // required
//           address,
//         ],
//         // hard coded
//         chainId: selectedChain, // required
//       });

//       setWalletConnectConnected(true);
//       setWallectConnectConnectorSession(connector.session);
//       const { peerMeta } = payload.params[0];
//       if (peerMeta) {
//         setWalletConnectPeerMeta(peerMeta);
//       }
//     });

//     // Subscribe to call requests
//     connector.on("call_request", async (error: any, payload: any) => {
//       if (error) {
//         throw error;
//       }

//       console.log("call_request payload", payload);

//       //   WalletConnectTransactionPopUp(payload, userProvider, connector, undefined, targetNetwork.chainId);
//     });

//     connector.on("disconnect", (error: any, payload: any) => {
//       if (error) {
//         throw error;
//       }
//       console.log("disconnect");

//       // disconnectFromWalletConnect(wallectConnectConnector, web3wallet);
//     });
//   };

//   const initWeb3wallet = async () => {
//     const web3wallet = await createWeb3wallet();

//     web3wallet.on("session_proposal", proposal => {
//       onSessionProposalTest(
//         web3wallet,
//         address,
//         proposal,
//         // setWalletConnectUri,
//         // setWalletConnectConnected,
//         // setWalletConnectPeerMeta,
//         // disconnectFromWalletConnect,
//       );
//     });
//     setWeb3wallet(web3wallet);
//   };

//   const [session1, setSession1] = useState();

//   const pairFunction = async () => {
//     web3wallet.on("session_proposal", async (proposal: any) => {
//       const session = await web3wallet.approveSession({
//         id: proposal.id,
//         namespaces: approvedNamespaces,
//       });
//       console.log("SESSSION", session);
//       setSession1(session);
//     });

//     // web3wallet.on("session_proposal", onSessionProposal);
//     await web3wallet.pair({ uri: walletConnectUri });
//     console.log("connected");
//   };

//   const pingFunction = async () => {
//     await web3wallet.core.pairing.ping({ topic: "438c0d95f21cd842c2da3a596bdd560fa1b6e308f59c24b15a0f9de0a6eb4c35" });
//   };

//   const rejectFunction = async () => {
//     web3wallet.on("session_proposal", async (proposal: any) => {
//       await web3wallet.rejectSession({
//         id: proposal.id,
//         reason: getSdkError("USER_REJECTED_METHODS"),
//       });
//       console.log("rejected");
//     });
//   };

//   const disconnectWalletConnect = async () => {
//     const topics = Object.keys(web3wallet.getActiveSessions());
//     // await web3wallet.disconnectSession({ , reason: getSdkError("USER_DISCONNECTED") });
//     for (const topic of topics) {
//       // eslint-disable-next-line @typescript-eslint/no-inferrable-types
//       const topic1: string = "9dbb15ee6cc12c76d68b3820c1d99f0fbf05cc306522b8817a86d22cd4017970";
//       console.log("Disconnecting from session ", typeof topic);
//       await web3wallet.disconnectSession({ topic1, reason: getSdkError("USER_DISCONNECTED") });
//     }
//   };

//   useEffect(() => {
//     if (!web3wallet) {
//       initWeb3wallet();
//     }
//     if (web3wallet) {
//       web3wallet.on("session_request", async (requestEvent: any) => {
//         console.log("session_request requestEvent", requestEvent);
//         // const { params } = requestEvent;
//         // console.log(params);

//         // WalletConnectTransactionPopUp(requestEvent, userProvider, undefined, web3wallet, targetNetwork.chainId);
//       });
//       web3wallet.core.pairing.events.on("pairing_delete", ({ id, topic }: any) => {
//         // clean up after the pairing for `topic` was deleted.
//         console.log("in Events pairing deleted", id, topic);
//       });
//     }
//   });

//   return (
//     <>
//       <h1 className="text-center font-bold mt-5">Wallet Connect</h1>
//       <button onClick={() => console.log(web3wallet)}>Wallet</button>
//       <button onClick={() => console.log(walletConnectUri)}>Uri</button>
//       <button
//         onClick={() =>
//           connectWallet({
//             // Required
//             uri: walletConnectUri,
//             // Required
//             clientMeta: {
//               description: "Forkable web wallet for small/quick transactions.",
//               url: "https://punkwallet_se2.io",
//               icons: ["https://punkwallet.io/punk.png"],
//               name: "🧑‍🎤 PunkWalletSE2.io",
//             },
//           })
//         }
//       >
//         Connect Wallet
//       </button>
//       <button onClick={() => pairFunction()}>Pair</button>
//       <button onClick={() => disconnectWalletConnect()}>Disconnect</button>
//       <button onClick={() => console.log(rejectFunction())}>Reject</button>
//       <button onClick={() => console.log(approvedNamespaces)}>namespaces</button>
//       <button onClick={() => console.log(session1)}>SessionObject</button>
//       <button onClick={() => console.log(Object.values(web3wallet.getActiveSessions()))}>Active Sessions</button>
//       <button onClick={() => console.log(web3wallet.core.pairing.getPairings())}>Pairings</button>
//       <button onClick={() => console.log(pingFunction())}>Ping</button>
//       <form>
//         <input
//           onChange={e => setWalletConnectUri(e.target.value)}
//           value={walletConnectUri}
//           placeholder="Enter WC URI (wc:1234...)"
//         />

//         <button onClick={() => console.log("nix")} title="Pair Session" type="button">
//           PAIR Session
//         </button>
//       </form>
//     </>
//   );
// };
