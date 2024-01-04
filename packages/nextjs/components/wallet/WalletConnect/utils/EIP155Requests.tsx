import { walletClientSelector } from "../../walletClientSelector";
import { EIP155_SIGNING_METHODS } from "./EIP155Lib";
import { getSignParamsMessage, getSignTypedDataParamsData } from "./Helpers";
import { formatJsonRpcResult } from "@walletconnect/jsonrpc-utils";
import { SignClientTypes } from "@walletconnect/types";
import { getSdkError } from "@walletconnect/utils";

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments["session_request"],
  account: any,
  selectedChain: any,
) {
  const { params, id } = requestEvent;
  const { request } = params;

  console.log("Account", account);
  console.log("selectedChain", selectedChain);
  console.log(request.method);

  const walletClient = walletClientSelector(selectedChain, account);

  if (walletClient) {
    switch (request.method) {
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
        console.log("personal_Sign");
      case EIP155_SIGNING_METHODS.ETH_SIGN:
        const message = getSignParamsMessage(request.params);
        const signedMessage = await walletClient.signMessage({ account, message });
        return formatJsonRpcResult(id, signedMessage);

      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
        const { domain, types, message: data } = getSignTypedDataParamsData(request.params);
        // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        delete types.EIP712Domain;
        // @ts-ignore
        const signedData = await walletClient.signTypedData({ account, domain, types, data });
        return formatJsonRpcResult(id, signedData);

      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
        const sendTransaction = request.params[0];

        const hash = await walletClient.sendTransaction(sendTransaction);
        return formatJsonRpcResult(id, hash);

      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        console.log("ETH SIGN TRANSACTION");
        const signTransaction = request.params[0];
        const signature = await walletClient.signTransaction(signTransaction);
        return formatJsonRpcResult(id, signature);

      default:
        throw new Error(getSdkError("INVALID_METHOD").message);
    }
  }
}

export function rejectEIP155Request(request: SignClientTypes.EventArguments["session_request"]) {
  const { id } = request;
  const response = {
    id,
    jsonrpc: "2.0",
    error: {
      code: 5000,
      message: "User rejected.",
    },
  };
  return response;
  //   return formatJsonRpcError(id, getSdkError("USER_REJECTED_METHODS").message);
}
