import { approveEIP155Request, rejectEIP155Request } from "../utils/EIP155Requests";
// import { getSignParamsMessage } from "../utils/Helpers";
import { web3wallet } from "../utils/WalletConnectUtils";
import { SignClientTypes } from "@walletconnect/types";

interface SignModalProps {
  visible: boolean;
  setModalVisible: (arg1: boolean) => void;
  requestSession: any;
  requestEvent: SignClientTypes.EventArguments["session_request"] | undefined;
  selectedChain: string;
  account: any;
}

export const SignModal = ({
  visible,
  setModalVisible,
  requestEvent,
  requestSession,
  account,
  selectedChain,
}: SignModalProps) => {
  console.log("RequestEvent form SignModal", requestEvent);
  console.log("RequestEvent form SignModal", requestSession);
  if (!requestEvent || !requestSession) return null;

  //   const chainID = requestEvent?.params?.chainId?.toUpperCase();
  const method = requestEvent?.params?.request?.method;
  //   MEssage throws an error
  //   const message = getSignParamsMessage(requestEvent?.params?.request?.params);

  const requestName = requestSession?.peer?.metadata?.name;
  //   const requestIcon = requestSession?.peer?.metadata?.icons[0];
  const requestURL = requestSession?.peer?.metadata?.url;

  const { topic } = requestEvent;

  async function onApprove() {
    if (requestEvent) {
      const response = await approveEIP155Request(requestEvent, account, selectedChain);
      if (response) {
        await web3wallet.respondSessionRequest({
          topic,
          response,
        });
      }
      setModalVisible(false);
    }
  }

  async function onReject() {
    if (requestEvent) {
      const response = rejectEIP155Request(requestEvent);
      await web3wallet.respondSessionRequest({
        topic,
        response,
      });
      setModalVisible(false);
      console.log(localStorage);
    }
  }

  return (
    <>
      <h1>SignModal</h1>
      {requestName}
      {requestURL}
      <br />
      {/* Message: {message} */}
      {visible}
      <br />
      {method}
      <button className="btn btn-primary mt-3" onClick={() => onApprove()}>
        Sign - Accept
      </button>
      <br />
      <button className="btn btn-error mt-3" onClick={() => onReject()}>
        Sign - Reject
      </button>
    </>
  );
};
