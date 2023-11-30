import { useEffect, useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { walletClientSelector } from "./walletClientSelector";
import { parseEther } from "viem";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Spinner } from "~~/components/assets/Spinner";
import { AddressInput, EtherInput } from "~~/components/scaffold-eth/Input";
import { useSharedState } from "~~/sharedStateContext";
import { notification } from "~~/utils/scaffold-eth";

interface NativeTokenTransactionProps {
  account: any;
  selectedChain: any;
}

export const NativeTokenTransaction = ({ account, selectedChain }: NativeTokenTransactionProps) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { isConfirmed, setIsConfirmed } = useSharedState();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const walletClient = walletClientSelector(selectedChain, account);
  const publicClient = publicClientSelector(selectedChain);

  const txRequest = async () => {
    if (walletClient && publicClient) {
      const transaction = await walletClient.sendTransaction({
        to: to,
        value: parseEther(amount),
      });
      console.log(transaction);
      setIsSent(true);
      setIsLoading(true);

      const tx = await publicClient.waitForTransactionReceipt({ hash: transaction });
      if (tx.status === "success") {
        setIsConfirmed(true);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isSent) {
      notification.success("Transaction successfully submitted");
      setIsSent(false);
    }
    if (isConfirmed && !isSent) {
      notification.success("Transaction successfully confirmed");
      setIsConfirmed(false);
    }
  }, [isSent, isConfirmed, setIsConfirmed]);

  return (
    <>
      <span className="w-1/2 mb-5">
        <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
      </span>
      <span className="w-1/2 mb-5">
        <EtherInput value={amount} onChange={amount => setAmount(amount)} placeholder="#" />
      </span>
      <button
        className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto"
        onClick={() => {
          txRequest();
        }}
      >
        {!isConfirmed && isLoading ? (
          <div className="flex w-[100px] justify-center">
            <Spinner width="100" height="100"></Spinner>
          </div>
        ) : (
          <div className="flex flex-row w-full">
            <EnvelopeIcon className="h-4 w-4" />
            <span className="mx-3"> Send </span>
          </div>
        )}
      </button>
    </>
  );
};
