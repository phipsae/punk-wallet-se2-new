import { useEffect, useState } from "react";
import { ERC20Input } from "../../scaffold-eth/Input/ERC20Input";
import { publicClientSelector } from "../publicClientSelector";
import { walletClientSelector } from "../walletClientSelector";
import { parseAbi, parseEther } from "viem";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Spinner } from "~~/components/assets/Spinner";
import { AddressInput } from "~~/components/scaffold-eth/Input";
import { useSharedState } from "~~/sharedStateContext";
import { notification } from "~~/utils/scaffold-eth";

interface ERC20TokenTransactionProps {
  account: any;
  selectedChain: any;
  tokenAddress: any;
}

const abi = parseAbi([
  // "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "function transfer(address to, uint256 value) public returns (bool)",
]);

export const ERC20TokenTransaction = ({ account, tokenAddress, selectedChain }: ERC20TokenTransactionProps) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [isSent, setIsSent] = useState(false);
  // const [isConfirmed, setIsConfirmed] = useState(false);
  const { isConfirmed, setIsConfirmed } = useSharedState();
  const [isLoading, setIsLoading] = useState(false);

  const walletClient = walletClientSelector(selectedChain, account);
  const publicClient = publicClientSelector(selectedChain);

  const txRequest = async () => {
    if (publicClient && walletClient) {
      try {
        const response = await publicClient.simulateContract({
          account: account,
          address: tokenAddress,
          abi: abi,
          functionName: "transfer",
          args: [to, parseEther(amount)],
        });

        const requestAny: any = response.request;
        console.log(requestAny);
        const txHash = await walletClient.writeContract(requestAny);
        setIsSent(true);
        setIsLoading(true);
        console.log(txHash);

        const tx = await publicClient.waitForTransactionReceipt({ hash: txHash });
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
              txRequest();
            }}
          >
            {!isConfirmed && isLoading ? (
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
