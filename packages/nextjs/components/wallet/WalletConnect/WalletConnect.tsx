// import { useCallback, useEffect, useState } from "react";
// import { createWeb3Wallet, web3wallet } from "./utils/WalletConnectUtils";
// import { Core } from "@walletconnect/core";
// import { SignClient } from "@walletconnect/sign-client";
// import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
// import { Web3Wallet, Web3WalletTypes } from "@walletconnect/web3wallet";
// // import { Web3Wallet } from "@walletconnect/web3wallet/dist/types/client";
// import { useSharedState } from "~~/sharedStateContext";

// export const WalletConnect = () => {
//   // ETHEREUM Wallet connect react app
//   const [currentWCURI, setCurrentWCURI] = useState(
//     "wc:2f3149afc03351c24565c683fe05bea8f6e6bb6283fc1f5ebacb544f079d600a@2?relay-protocol=irn&symKey=6fc7f0a3c1dec613af93b73e447caef0c59183ff865c0654ae3c384ea507b9c5",
//   );
//   const [web3walletNew, setWeb3WalletNew] = useState<Web3Wallet | null>(null);
//   const [signClient, setSignClient] = useState();

//   async function createClient() {
//     try {
//       const client = await SignClient.init();
//       console.log("createClient", client);
//       setSignClient(client);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     if (!signClient) {
//       createClient();
//     }
//   }, [signClient]);

//   return (
//     <>
//       <h1>Wallet Connect</h1>
//       <button onClick={() => console.log(createWeb3Wallet())}>Click Me</button>
//       <form>
//         <input
//           onChange={e => setCurrentWCURI(e.target.value)}
//           value={currentWCURI}
//           placeholder="Enter WC URI (wc:1234...)"
//         />

//         <button onClick={() => pair()} title="Pair Session">
//           PAIR Session
//         </button>
//       </form>
//     </>
//   );
// };
