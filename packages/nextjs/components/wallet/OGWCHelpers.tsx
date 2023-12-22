// import { createEthersWallet, sendTransaction } from "./EIP1559Helper";
import WalletConnectV2ConnectionError from "./OGWalletConnectV2ConnectionError";
import { Tokens } from "./Tokens";
// import { TransactionManager } from "./TransactionManager";
import { Core } from "@walletconnect/core";
import { getSdkError } from "@walletconnect/utils";
import { buildApprovedNamespaces } from "@walletconnect/utils";
import { Web3Wallet } from "@walletconnect/web3wallet";

// import { isHex, keccak256 } from "viem";

export const createWeb3wallet = async () => {
  const core = new Core({
    logger: "debug",
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  });

  return await Web3Wallet.init({
    core, // <- pass the shared `core` instance
    metadata: {
      description: "Forkable web wallet for small/quick transactions.",
      url: "https://punkwalletSE2.io",
      icons: ["https://punkwallet.io/punk.png"],
      name: "🧑‍🎤 PunkWalletSE2",
    },
  });
};

export let approvedNamespaces: any;

// export const onSessionProposalTest = async (
//   web3wallet: any,
//   proposal: any,
//   { id, params }: Web3WalletTypes.SessionProposal,
// ) => {
//   console.log("proposal", proposal);
//   try {
//     // ------- namespaces builder util ------------ //
//     approvedNamespaces = buildApprovedNamespaces({
//       proposal: params,
//       supportedNamespaces: {
//         eip155: {
//           chains: getSupportedChainIds().map(chainId => "eip155:" + chainId), // ["eip155:1", "eip155:137", ...]
//           methods: [
//             "eth_sendTransaction",
//             "eth_signTransaction",
//             "eth_sign",
//             "personal_sign",
//             "eth_signTypedData",
//             "eth_signTypedData_v4",
//           ],
//           events: ["accountsChanged", "chainChanged"],
//           accounts: getSupportedChainIds().map(chainId => "eip155:" + chainId + ":" + address), // ["eip155:1:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", "eip155:137:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", ...]
//         },
//       },
//     });
//     // ------- end namespaces builder util ------------ //

//     // const session = await web3wallet.approveSession({
//     //   id,
//     //   namespaces: approvedNamespaces,
//     // });
//   } catch (error) {
//     // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
//     console.log("error from onSessionProposl", error);
//     // await web3wallet.rejectSession({
//     //   id: proposal.id,
//     //   reason: getSdkError("USER_REJECTED"),
//     // });
//   }
// };

export const onSessionProposal = async (
  web3wallet: any,
  address: any,
  proposal: any,
  setWalletConnectUrl: any,
  setWalletConnectConnected: any,
  //   setWalletConnectPeerMeta?: any,
  //   disconnectFromWalletConnect?: any,
  //   popUp: any,
) => {
  console.log("proposal", proposal);

  if (isWalletConnectV2Connected(web3wallet)) {
    // await disconnectFromWalletConnect(undefined, web3wallet);
  }

  const { id, params } = proposal;
  const { proposer, relays } = params;

  try {
    approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: getSupportedChainIds().map(chainId => "eip155:" + chainId), // ["eip155:1", "eip155:137", ...]
          methods: [
            "eth_sendTransaction",
            "eth_signTransaction",
            "eth_sign",
            "personal_sign",
            "eth_signTypedData",
            "eth_signTypedData_v4",
          ],
          events: ["accountsChanged", "chainChanged"],
          accounts: getSupportedChainIds().map(chainId => "eip155:" + chainId + ":" + address), // ["eip155:1:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", "eip155:137:0x8c9D11cE64289701eFEB6A68c16e849E9A2e781d", ...]
        },
      },
    });
  } catch (error) {
    console.error("Something is wrong with the namespaces", error);
    setWalletConnectUrl("");

    // ToDo display error
    await web3wallet.rejectSession({
      id: id,
      reason: getSdkError("UNSUPPORTED_CHAINS"), // Best guess, we could parse the error message to figure out the exact reason
    });

    WalletConnectV2ConnectionError(error, proposer);

    return;
  }

  await web3wallet.approveSession({
    id,
    relayProtocol: relays[0].protocol,
    namespaces: approvedNamespaces,
  });

  connectWalletConnectV2(web3wallet, setWalletConnectConnected);
};

export const approveRequestV1 = (connector: any, id: any, result: any) => {
  console.log("Approving Wallet Connect V1 request", id);

  connector.approveRequest({
    id,
    result,
  });
};

export const approveRequestV2 = (web3wallet: any, event: any, result: any) => {
  const { topic, id } = event;
  console.log("Approving Wallet Connect V2 request", id);

  const response = { id, result, jsonrpc: "2.0" };

  web3wallet.respondSessionRequest({ topic, response });
};

export const rejectRequestV1 = (connector: any, id: any) => {
  console.log("Rejecting Wallet Connect V1 request", id);

  connector.rejectRequest({
    id,
    error: { message: "User rejected" },
  });
};

export const rejectRequestV2 = (web3wallet: any, event: any) => {
  const { topic, id } = event;
  console.log("Rejecting Wallet Connect V2 request", id);

  const response = {
    id,
    jsonrpc: "2.0",
    error: {
      code: 5000,
      message: "User rejected.",
    },
  };

  web3wallet.respondSessionRequest({ topic, response });
};

// Get All
const getSupportedChainIds = () => {
  const supportedChainIds = [];

  for (const network of Object.values(Tokens)) {
    supportedChainIds.push(network.chainId);
  }

  return supportedChainIds;
};

export const getWalletConnectV2ActiveSession = (web3wallet: any) => {
  return Object.values(web3wallet.getActiveSessions())[0];
};

export const isWalletConnectV2Connected = (web3wallet: any) => {
  const activeSession = getWalletConnectV2ActiveSession(web3wallet);
  if (activeSession) {
    return true;
  }
  return false;
};

export const connectWalletConnectV2 = (
  web3wallet: any,
  setWalletConnectConnected: any,
  //   setWalletConnectPeerMeta: any,
) => {
  const activeSession = getWalletConnectV2ActiveSession(web3wallet);

  if (activeSession) {
    setWalletConnectConnected(true);
    // setWalletConnectPeerMeta(activeSession?.peer?.metadata);
  }
};

export const disconnectWallectConnectV2Sessions = async (web3wallet: any) => {
  console.log("Disconnecting from Wallet Connect 2 session");

  // Wallet Connect V2 has a lot more options than V1, we could have multiple sessions and pairings
  // But for now let's use only one session and disconnect from all sessions (there should be only one though right now)

  const topics = Object.keys(web3wallet.getActiveSessions());

  for (const topic of topics) {
    console.log("Disconnecting from session ", topic);
    await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") });
  }

  /*  We could also disconnect from the pairings, but I think it is a better user experience if we keep them
		  Dapps can keep the pairings and reconnect

		web3wallet.engine.signClient.core.pairing.pairings.values
		.forEach(
		  async (pairing) => {
		      const topic = pairing.topic;
		      console.log("Disconnecting from pair ", topic);
		      await web3wallet.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
		});
	*/
};

export const updateWalletConnectSession = (wallectConnectConnector: any, address: any, localChainId: any) => {
  wallectConnectConnector.updateSession({
    accounts: [address],
    chainId: localChainId,
  });
};

// export const signTransaction = (txParams: any) => {
//   const ethersWallet = createEthersWallet();

//   // Ethers uses gasLimit instead of gas
//   if (txParams.gas) {
//     txParams.gasLimit = txParams.gas;
//     delete txParams.gas;
//   }

//   return ethersWallet.signTransaction(txParams);
// };

// export const signMessage = (message: any) => {
//   const ethersWallet = createEthersWallet();

//   if (isHex(message)) {
//     message = keccak256(toBytes(message));
//   }

//   return ethersWallet.signMessage(message);
// };

// export const sendWalletConnectTx = async (userProvider: any, payload: any, chainId: any) => {
//   let result;

//   try {
//     let signer = userProvider.getSigner();

//     // I'm not sure if all the Dapps send an array or not
//     let params = payload.params;
//     if (Array.isArray(params)) {
//       params = params[0];
//     }

//     // Ethers uses gasLimit instead of gas
//     if (params.gas) {
//       let gasLimit = params.gas;
//       params.gasLimit = gasLimit;
//       delete params.gas;
//     }

//     // Speed up transaction list is filtered by chainId
//     if (!params.chainId) {
//       params.chainId = chainId;
//     }

//     // Remove empty data
//     // I assume wallet connect adds "data" here: https://github.com/WalletConnect/walletconnect-monorepo/blob/7573fa9e1d91588d4af3409159b4fd2f9448a0e2/packages/helpers/utils/src/ethereum.ts#L78
//     // And ethers cannot hexlify this: https://github.com/ethers-io/ethers.js/blob/8b62aeff9cce44cbd16ff41f8fc01ebb101f8265/packages/providers/src.ts/json-rpc-provider.ts#L694
//     if (params.data === "") {
//       delete params.data;
//     }

//     result = await sendTransaction(params, signer);

//     const transactionManager = new TransactionManager();
//     transactionManager.setTransactionResponse(result);
//   } catch (error) {
//     // Fallback to original code without the speed up option
//     console.error("Coudn't create transaction which can be speed up", error);
//     result = await userProvider.send(payload.method, payload.params);
//   }

//   return result;
// };
