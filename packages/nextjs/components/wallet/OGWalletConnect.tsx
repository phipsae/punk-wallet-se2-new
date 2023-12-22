// import { useCallback, useEffect, useState } from "react";
// import {
//   approvedNamespaces,
//   connectWalletConnectV2,
//   createWeb3wallet,
//   disconnectWallectConnectV2Sessions,
//   isWalletConnectV2Connected,
//   onSessionProposal,
//   updateWalletConnectSession,
// } from "./OGWCHelpers";
// import WalletConnectV2ConnectionError from "./OGWalletConnectV2ConnectionError";
// import WalletConnect from "@walletconnect/client";
// import { useAccount } from "wagmi";

// export const OGWalletConnect = () => {
//   const localChainId = 1;
//   const { address } = useAccount();
//   const connectWallet = (sessionDetails: any) => {
//     console.log(" 📡 Connecting to Wallet Connect....", sessionDetails);

//     let connector: any;
//     try {
//       connector = new WalletConnect(sessionDetails);
//       const { peerMeta } = connector;
//       if (peerMeta) {
//         setWalletConnectPeerMeta(peerMeta);
//       }
//     } catch (error) {
//       console.error("Coudn't connect to", sessionDetails, error);
//       localStorage.removeItem("walletConnectUrl");
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
//         chainId: 1, // required
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

//       disconnectFromWalletConnect(wallectConnectConnector, web3wallet);
//     });
//   };

//   const disconnectFromWalletConnect = async (wallectConnectConnector: any, web3wallet: any) => {
//     try {
//       if (wallectConnectConnector) {
//         console.log("Disconnect from Wallet Connect V1");
//         await wallectConnectConnector.killSession();
//       }
//     } catch (error) {
//       console.error("Coudn't disconnect from Wallet Connect V1", error);
//     }

//     try {
//       if (web3wallet && isWalletConnectV2Connected(web3wallet)) {
//         console.log("Disconnect from Wallet Connect V2");
//         await disconnectWallectConnectV2Sessions(web3wallet);
//       }
//     } catch (error) {
//       console.error("Coudn't disconnect from Wallet Connect V2", error);

//       // This is a hack to remove the session manually
//       // Otherwise if an old session is stuck, we cannot delete it
//       localStorage.removeItem("wc@2:client:0.3//session");
//     }

//     setWalletConnectUrl("");
//     setWalletConnectPeerMeta(undefined);
//     setWallectConnectConnector(undefined);
//     setWallectConnectConnectorSession("");

//     // This has to be the last, so we don't try to reconnect in "Wallet Connect Hook" too early
//     setWalletConnectConnected(false);
//   };

//   const [walletConnectUrl, setWalletConnectUrl] = useState<string>(
//     "wc:4c2407c0b177a616ca9875f6d1754b91f488f228c9b5af3e5b0d2ecbcb39248a@2?relay-protocol=irn&symKey=b7d86b861d494fefc11d41c995e9f0313600927ded3ff1d5fd00ae16d480733c",
//   );
//   const [walletConnectConnected, setWalletConnectConnected] = useState<boolean>();
//   const [walletConnectPeerMeta, setWalletConnectPeerMeta] = useState<string>();

//   const [wallectConnectConnector, setWallectConnectConnector] = useState<any>();
//   //store the connector session in local storage so sessions persist through page loads ( thanks Pedro <3 )
//   const [wallectConnectConnectorSession, setWallectConnectConnectorSession] = useState<any>();

//   const [web3wallet, setWeb3wallet] = useState<any>();

//   const testFunction = async () => {
//     web3wallet.on("session_proposal", async (proposal: any) => {
//       const session = await web3wallet.approveSession({
//         id: proposal.id,
//         namespaces: approvedNamespaces,
//       });
//       console.log("SESSSION", session);
//     });

//     await web3wallet.pair({ uri: walletConnectUrl });
//   };

//   // Wallet Connect V2 initialization and listeners
//   useEffect(() => {
//     if (!address) {
//       return;
//     }

//     async function initWeb3wallet() {
//       const web3wallet = await createWeb3wallet();

//       web3wallet.on("session_proposal", proposal => {
//         onSessionProposal(
//           web3wallet,
//           address,
//           proposal,
//           disconnectFromWalletConnect,
//           setWalletConnectUrl,
//           setWalletConnectConnected,
//           setWalletConnectPeerMeta,
//         );
//       });

//       web3wallet.on("session_request", async requestEvent => {
//         console.log("session_request requestEvent", requestEvent);

//         // WalletConnectTransactionPopUp(requestEvent, userProvider, undefined, web3wallet, targetNetwork.chainId);
//       });

//       web3wallet.on("session_update", async event => {
//         console.log("session_update event", event);
//       });

//       web3wallet.on("session_delete", async event => {
//         console.log("session_delete event", event);

//         await disconnectFromWalletConnect(undefined, web3wallet);
//       });

//       web3wallet.on("session_event", async event => {
//         console.log("session_event", event);
//       });

//       web3wallet.on("session_ping", async event => {
//         console.log("session_ping", event);
//       });

//       web3wallet.on("session_expire", async event => {
//         console.log("session_expire", event);
//       });

//       web3wallet.on("session_extend", async event => {
//         console.log("session_extend", event);
//       });

//       web3wallet.on("proposal_expire", async event => {
//         console.log("proposal_expire", event);
//       });

//       setWeb3wallet(web3wallet);
//     }

//     initWeb3wallet();
//   }, [address]);

//   useEffect(() => {
//     if (!web3wallet) {
//       return;
//     }

//     connectWalletConnectV2(web3wallet, setWalletConnectConnected, setWalletConnectPeerMeta);
//   }, [web3wallet]);

//   // Add an event listener to kill Wallet Connect V1 session when V2 Dapp reconnects
//   // and there was an existing V1 session
//   useEffect(() => {
//     if (!web3wallet || !wallectConnectConnector) {
//       return;
//     }

//     const listener = () => {
//       if (wallectConnectConnector) {
//         console.log("Kill Wallet Connect V1 session");
//         wallectConnectConnector.killSession();
//       }
//     };

//     web3wallet.on("session_proposal", listener);

//     return () => {
//       web3wallet?.off("session_proposal", listener);
//     };
//   }, [web3wallet, wallectConnectConnector]);

//   useEffect(() => {
//     if (wallectConnectConnector && wallectConnectConnector.connected && address) {
//       const connectedAccounts = wallectConnectConnector?.accounts;
//       let connectedAddress;

//       if (connectedAccounts) {
//         connectedAddress = connectedAccounts[0];
//       }

//       // Use Checksummed addresses
//       if (connectedAddress && ethers.utils.getAddress(connectedAddress) != ethers.utils.getAddress(address)) {
//         console.log("Updating wallet connect session with the new address");
//         console.log("Connected address", ethers.utils.getAddress(connectedAddress));
//         console.log("New address ", ethers.utils.getAddress(address));

//         updateWalletConnectSession(wallectConnectConnector, address, localChainId);
//       }

//       const connectedChainId = wallectConnectConnector?.chainId;

//       if (connectedChainId && connectedChainId != localChainId) {
//         console.log("Updating wallet connect session with the new chainId");
//         console.log("Connected chainId", connectedChainId);
//         console.log("New chainId ", localChainId);

//         updateWalletConnectSession(wallectConnectConnector, address, localChainId);
//       }
//     }
//   }, [address, localChainId, wallectConnectConnector]);

//   // "Wallet Connect Hook"
//   useEffect(() => {
//     if (!walletConnectConnected && address) {
//       if (wallectConnectConnectorSession) {
//         console.log("NOT CONNECTED AND wallectConnectConnectorSession", wallectConnectConnectorSession);
//         connectWallet(wallectConnectConnectorSession);
//         setWalletConnectConnected(true);
//       } else if (walletConnectUrl) {
//         // Version 2 is handled separately
//         if (walletConnectUrl.includes("@2")) {
//           return;
//         }

//         //CLEAR LOCAL STORAGE?!?
//         console.log("clear local storage and connect...");
//         localStorage.removeItem("walletconnect"); // lololol
//         connectWallet(
//           {
//             // Required
//             uri: walletConnectUrl,
//             // Required
//             clientMeta: {
//               description: "Forkable web wallet for small/quick transactions.",
//               url: "https://punkwallet.io",
//               icons: ["https://punkwallet.io/punk.png"],
//               name: "🧑‍🎤 PunkWallet.io",
//             },
//           } /*,
//                   {
//                     // Optional
//                     url: "<YOUR_PUSH_SERVER_URL>",
//                     type: "fcm",
//                     token: token,
//                     peerMeta: true,
//                     language: language,
//                   }*/,
//         );
//       }
//     }
//   }, [walletConnectUrl, address, walletConnectConnected, wallectConnectConnectorSession, connectWallet]);

//   useEffect(() => {
//     async function pairWalletConnectV2() {
//       if (
//         walletConnectUrl &&
//         walletConnectUrl.includes("@2") &&
//         web3wallet &&
//         !isWalletConnectV2Connected(web3wallet)
//       ) {
//         console.log(" 📡 Connecting to Wallet Connect V2....", walletConnectUrl);
//         try {
//           await web3wallet.core.pairing.pair({ uri: walletConnectUrl });
//         } catch (error) {
//           console.log("Cannot create pairing", error);
//           WalletConnectV2ConnectionError(error, undefined);
//           setWalletConnectUrl("");
//         }
//       }
//     }

//     pairWalletConnectV2();
//   }, [walletConnectUrl, web3wallet]);

//   return (
//     <>
//       <h1 className="text-center font-bold mt-5">OG Wallet Connect</h1>
//       <button onClick={() => console.log(web3wallet)}>Click Me</button>
//       <button onClick={() => testFunction()}>Create Wallet</button>
//       <button onClick={() => console.log(isWalletConnectV2Connected(web3wallet))}>Click Me</button>
//       {/* <button onClick={() => console.log(pairWalletConnectV2())}>Click Me</button> */}
//       <form>
//         <input
//           onChange={e => setWalletConnectUrl(e.target.value)}
//           value={walletConnectUrl}
//           placeholder="Enter WC URI (wc:1234...)"
//         />

//         <button onClick={() => console.log("PAIR")} title="Pair Session" type="button">
//           PAIR Session
//         </button>
//       </form>
//       <div style={{ clear: "both", maxWidth: "100%", width: 975, margin: "auto", marginTop: 32, position: "relative" }}>
//         {wallectConnectConnector && !wallectConnectConnector.connected && (
//           <div>
//             <Spin />
//             <div>Connecting to the Dapp...</div>
//           </div>
//         )}
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
//           {walletConnectConnected ? (
//             <>
//               {walletConnectPeerMeta?.icons[0] ? (
//                 <span style={{ paddingRight: 10 }}>
//                   {walletConnectPeerMeta?.icons[0] && (
//                     <img
//                       style={{ width: 40 }}
//                       src={walletConnectPeerMeta.icons[0]}
//                       alt={walletConnectPeerMeta.name ? walletConnectPeerMeta.name : ""}
//                     />
//                   )}
//                 </span>
//               ) : (
//                 <span style={{ fontSize: 30, paddingRight: 10 }}>✅</span>
//               )}
//             </>
//           ) : (
//             ""
//           )}
//           <input
//             style={{ width: "40%", textAlign: "center" }}
//             placeholder={"wallet connect url (or use the scanner-->)"}
//             value={walletConnectPeerMeta?.name ? walletConnectPeerMeta.name : walletConnectUrl}
//             disabled={walletConnectConnected}
//             onChange={e => {
//               setWalletConnectUrl(e.target.value);
//             }}
//           />
//           {walletConnectConnected ? (
//             <span
//               style={{ cursor: "pointer", fontSize: 30, paddingLeft: 10 }}
//               onClick={() => {
//                 disconnectFromWalletConnect(wallectConnectConnector, web3wallet);
//               }}
//             >
//               🗑
//             </span>
//           ) : (
//             ""
//           )}
//         </div>
//       </div>
//     </>
//   );
// };
