import { useEffect, useState } from "react";
import { ERC20Input } from "../../scaffold-eth/Input/ERC20Input";
import { parseAbi, parseEther } from "viem";
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Spinner } from "~~/components/assets/Spinner";
import { AddressInput } from "~~/components/scaffold-eth/Input";
import { notification } from "~~/utils/scaffold-eth";

interface WagmiERC20TokenTransactionProps {
  tokenAddress: any;
}

const abi = parseAbi([
  // "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "function transfer(address to, uint256 value) public returns (bool)",
]);

export const WagmiERC20TokenTransaction = ({ tokenAddress }: WagmiERC20TokenTransactionProps) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: abi,
    functionName: "transfer",
    args: [to, parseEther(amount)],
  });

  const { data, isLoading, write } = useContractWrite(config);

  const { isLoading: isLoadingSumbitTransactionWait, isSuccess: isSuccessSubmitTransactionWait } =
    useWaitForTransaction({
      hash: data?.hash,
    });

  useEffect(() => {
    if (isLoadingSumbitTransactionWait) {
      notification.success("Transaction submitted", { icon: "⏱️" });
      // setIsSent(false);
    }
    if (isSuccessSubmitTransactionWait) {
      notification.success("Transaction successfully confirmed");
      // setIsConfirmed(false);
    }
  }, [isLoadingSumbitTransactionWait, isSuccessSubmitTransactionWait]);

  return (
    <>
      <div className="flex flex-col items-center mt-5">
        <div className="w-3/4 mb-3">
          <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
        </div>
        <div className="w-3/4 mb-3">
          <ERC20Input value={amount} onChange={amount => setAmount(amount)} placeholder="#" />
        </div>
        <div className="w-3/4">
          <button
            disabled={isLoading}
            className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto w-full"
            onClick={() => {
              write?.();
            }}
          >
            {!isSuccessSubmitTransactionWait && isLoadingSumbitTransactionWait ? (
              <div className="flex justify-center">
                <Spinner width="100" height="100"></Spinner>
              </div>
            ) : (
              <div className="flex flex-row ">
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
