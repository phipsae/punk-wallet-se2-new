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

// to get rid of the typescript errors
function isDialogElement(element: HTMLElement | null): element is HTMLDialogElement {
  return element !== null && "close" in element;
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

  const chainID = requestEvent?.params?.chainId?.toUpperCase();
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

  console.log("Sign Incoming");

  const signModal = document.getElementById("sign_modal");
  if (isDialogElement(signModal)) {
    signModal.showModal();
  }

  return (
    <>
      <dialog id="sign_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Request from {requestName}</h3>
          <div>
            <p className="py-4">Config</p>
            <br />
            Visible: {visible}
            <br />
            ChainsID: {chainID}
            <br />
            RequestUrl: {requestURL}
            <br />
            Method: {method}
            <br />
            <div className="modal-action">
              <form method="dialog">
                {/* <button className="btn">Close</button> */}
                <button className="btn btn-primary mt-3" onClick={() => onApprove()}>
                  Sign - Accept
                </button>
                <br />
                <button className="btn btn-error mt-3" onClick={() => onReject()}>
                  Sign - Reject
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>

      {/* Message: {message} */}

      <br />
    </>
  );
};
