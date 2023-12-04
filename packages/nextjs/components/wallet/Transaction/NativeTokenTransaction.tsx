import { useEffect, useState } from "react";
import { publicClientSelector } from "../publicClientSelector";
import { walletClientSelector } from "../walletClientSelector";
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
      try {
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
      } catch (error) {
        console.log(error);
        notification.error("Not sufficient funds");
      }
    }
  };

  useEffect(() => {
    if (isSent) {
      notification.success("Transaction submitted", { icon: "⏱️" });
      setIsSent(false);
    }
    if (isConfirmed && !isSent) {
      notification.success("Transaction successfully confirmed");
      setIsConfirmed(false);
    }
  }, [isSent, isConfirmed, setIsConfirmed]);

  return (
    <>
      <div className="flex flex-col mt-5 items-center">
        <div className="w-3/4 mb-3">
          <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
        </div>
        <div className="w-3/4 mb-3">
          <EtherInput value={amount} onChange={amount => setAmount(amount)} placeholder="#" />
        </div>
        <div className="w-3/4 mb-5">
          <button
            disabled={isLoading}
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto w-full"
            onClick={() => {
              txRequest();
            }}
          >
            {!isConfirmed && isLoading ? (
              <div className="flex justify-center">
                <Spinner width="100" height="100"></Spinner>
              </div>
            ) : (
              <div className="flex flex-row">
                <EnvelopeIcon className="h-4 w-4" />
                <span className="mx-3"> Send </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
