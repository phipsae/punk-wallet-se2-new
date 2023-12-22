// import { useCallback, useEffect, useState } from "react";
// import {
//   approvedNamespaces,
//   createWeb3Wallet,
//   isWalletConnectV2Connected,
//   onSessionProposal,
//   web3wallet,
// } from "./utils/WalletConnectUtils";
// import { privateKeyToAccount } from "viem/accounts";
// import { useSharedState } from "~~/sharedStateContext";

// export const WalletConnectDappBackUp = () => {
//   // ETHEREUM Wallet connect react app
//   const { selectedPrivateKey } = useSharedState();

//   const [account, setAccount] = useState<any>(null);

//   const [currentWCURI, setCurrentWCURI] = useState(
//     "wc:a80a0864e79a9f5d9d94d18222b1dde8241e426d441bdcbebc7ad83dd849d0e0@2?relay-protocol=irn&symKey=c1e47b4ad00fc2303e5cab5ecb1deaa06287938cab2bf0cbbd5f2d10058e41ab",
//   );
//   const [walletConnectConnected, setWalletConnectConnected] = useState();
//   const [walletConnectPeerMeta, setWalletConnectPeerMeta] = useState();
//   const [web3walletNew, setWeb3walletNew] = useState();

//   let connector;

//   useEffect(() => {
//     const updateAccount = () => {
//       if (selectedPrivateKey !== "") {
//         setAccount(privateKeyToAccount(selectedPrivateKey as `0x${string}`));
//       } else {
//         setAccount(privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`));
//       }
//     };

//     updateAccount();
//     if (!account) {
//       return;
//     }

//     if (!web3wallet) {
//       createWeb3Wallet();
//     }

//     async function initWeb3wallet() {
//       web3wallet.on("session_proposal", (proposal: any) => {
//         onSessionProposal(
//           web3wallet,
//           account.address,
//           proposal,
//           setCurrentWCURI,
//           setWalletConnectConnected,
//           setWalletConnectPeerMeta,
//           // disconnectFromWalletConnect,
//         );
//         console.log(proposal);
//       });

//       web3wallet.on("session_request", async requestEvent => {
//         console.log("session_request requestEvent", requestEvent);

//         // WalletConnectTransactionPopUp(requestEvent, userProvider, undefined, web3wallet, targetNetwork.chainId);
//       });

//       web3wallet.on("session_proposal", async proposal => {
//         const session = await web3wallet.approveSession({
//           id: proposal.id,
//           namespaces,
//         });
//       });

//       // web3wallet.on("session_update", async event => {
//       //   console.log("session_update event", event);
//       // });

//       // web3wallet.on("session_delete", async event => {
//       //   console.log("session_delete event", event);

//       //   await disconnectFromWalletConnect(undefined, web3wallet);
//       // });

//       // web3wallet.on("session_event", async event => {
//       //   console.log("session_event", event);
//       // });

//       // web3wallet.on("session_ping", async event => {
//       //   console.log("session_ping", event);
//       // });

//       // web3wallet.on("session_expire", async event => {
//       //   console.log("session_expire", event);
//       // });

//       // web3wallet.on("session_extend", async event => {
//       //   console.log("session_extend", event);
//       // });

//       // web3wallet.on("proposal_expire", async event => {
//       //   console.log("proposal_expire", event);
//       // });

//       console.log("web3wallet", web3wallet);
//     }

//     initWeb3wallet();
//   }, []);

//   useEffect(() => {
//     async function pairWalletConnectV2() {
//       if (currentWCURI && currentWCURI.includes("@2") && web3wallet && !isWalletConnectV2Connected(web3wallet)) {
//         console.log(" 📡 Connecting to Wallet Connect V2....", currentWCURI);
//         try {
//           await web3wallet.core.pairing.pair({ uri: currentWCURI });
//         } catch (error) {
//           console.log("Cannot create pairing", error);
//           // WalletConnectV2ConnectionError(error, undefined);
//           setCurrentWCURI("");
//         }
//       }
//     }

//     pairWalletConnectV2();
//   }, [currentWCURI]);

//   // const [modalVisible, setModalVisible] = useState(false);
//   // const [currentProposal, setCurrentProposal] = useState();
//   // const [successfulSession, setSuccessfulSession] = useState(false);

//   // const [pairing, setPairing] = useState();

//   // const [pairings, setPairings] = useState(web3wallet.core.pairing.getPairings());

//   // async function web3WalletPair(params: { uri: string }) {
//   //   const pairing = await web3wallet.core.pairing.pair({ uri: params.uri });
//   //   return pairing;
//   // }

//   // const pair = () => {
//   //   if (web3wallet) {
//   //     const test = web3WalletPair({ uri: currentWCURI });
//   //     setPairing(test);
//   //   }
//   // };

//   // const onSessionProposal = useCallback((proposal: SignClientTypes.EventArguments["session_proposal"]) => {
//   //   // setModalVisible(true);
//   //   setCurrentProposal(proposal);
//   // }, []);

//   // useEffect(() => {
//   //   if (!web3wallet) {
//   //     createWeb3Wallet();
//   //   } else {
//   //     web3wallet?.on("session_proposal", onSessionProposal);
//   //   }
//   // }, [onSessionProposal]);

//   return (
//     <>
//       <h1>Wallet Connect</h1>
//       <button onClick={() => console.log(approvedNamespaces)}>Click Me</button>
//       <button onClick={() => createWeb3Wallet()}>Create Wallet</button>
//       <button onClick={() => console.log(isWalletConnectV2Connected(web3wallet))}>Click Me</button>
//       <form>
//         <input
//           onChange={e => setCurrentWCURI(e.target.value)}
//           value={currentWCURI}
//           placeholder="Enter WC URI (wc:1234...)"
//         />

//         <button onClick={() => pair()} title="Pair Session" type="button">
//           PAIR Session
//         </button>
//       </form>
//     </>
//   );
// };
