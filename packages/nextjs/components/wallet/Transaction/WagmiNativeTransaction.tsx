import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { parseEther } from "viem";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Spinner } from "~~/components/assets/Spinner";
import { AddressInput, EtherInput } from "~~/components/scaffold-eth/Input";
import { notification } from "~~/utils/scaffold-eth";

export function WagmiNativeTransaction() {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    to: debouncedTo,
    value: debouncedAmount ? parseEther(debouncedAmount) : undefined,
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    if (isLoading) {
      notification.success("Transaction submitted", { icon: "⏱️" });
    }
    if (isSuccess) {
      notification.success("Transaction successfully confirmed");
    }
  }, [isSuccess, isLoading]);

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
              sendTransaction?.();
            }}
          >
            {!isSuccess && isLoading ? (
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
}
