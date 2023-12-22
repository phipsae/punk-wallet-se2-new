import { Tokens } from "../../Tokens";
import WalletConnectV2ConnectionError from "./WalletConnectV2ConnectionError";
import { Core } from "@walletconnect/core";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { IWeb3Wallet, Web3Wallet } from "@walletconnect/web3wallet";

export let web3wallet: IWeb3Wallet;
export let approvedNamespaces: any;

export async function createWeb3Wallet() {
  const core = new Core({
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
    // relayUrl: relayerRegionURL ?? process.env.NEXT_PUBLIC_RELAY_URL,
  });

  web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: "React Wallet Example",
      description: "React Wallet for WalletConnect",
      url: "https://walletconnect.com/",
      icons: ["https://avatars.githubusercontent.com/u/37784886"],
    },
  });

  try {
    const clientId = await web3wallet.engine.signClient.core.crypto.getClientId();
    console.log("WalletConnect ClientID: ", clientId);
    localStorage.setItem("WALLETCONNECT_CLIENT_ID", clientId);
  } catch (error) {
    console.error("Failed to set WalletConnect clientId in localStorage: ", error);
  }
}

export const onSessionProposal = async (
  web3wallet: any,
  address: any,
  proposal: any,
  setWalletConnectUrl: any,
  setWalletConnectConnected: any,
  // setWalletConnectPeerMeta: any,
  // disconnectFromWalletConnect?: any,
) => {
  console.log("proposal", proposal);

  // if (isWalletConnectV2Connected(web3wallet)) {
  //   await disconnectFromWalletConnect(undefined, web3wallet);
  // }

  const { id, params } = proposal;
  const { proposer, relays } = params;

  // https://docs.walletconnect.com/2.0/web/web3wallet/wallet-usage#-namespaces-builder-util
  // let approvedNamespaces;
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
    web3wallet.rejectSession({
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

// Helper
const getSupportedChainIds = () => {
  const supportedChainIds = [];

  for (const network of Object.values(Tokens)) {
    supportedChainIds.push(network.chainId);
  }

  return supportedChainIds;
};

export const connectWalletConnectV2 = (
  web3wallet: any,
  setWalletConnectConnected: any,
  // setWalletConnectPeerMeta: any,
) => {
  const activeSession = getWalletConnectV2ActiveSession(web3wallet);

  if (activeSession) {
    setWalletConnectConnected(true);
    // setWalletConnectPeerMeta(activeSession?.peer?.metadata);
  }
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
