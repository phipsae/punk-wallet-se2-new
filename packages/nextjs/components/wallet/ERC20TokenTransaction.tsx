import { useEffect, useState } from "react";
import { ERC20Input } from "../scaffold-eth/Input/ERC20Input";
import { publicClientSelector } from "./publicClientSelector";
import { walletClientSelector } from "./walletClientSelector";
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
      const response = await publicClient.simulateContract({
        account: account,
        address: tokenAddress,
        abi: abi,
        functionName: "transfer",
        args: [to, parseEther(amount)],
      });

      const requestAny: any = response.request;
      console.log(requestAny);
      await walletClient.writeContract(requestAny);
      setIsSent(true);
      setIsLoading(true);

      const unwatch = publicClient.watchContractEvent({
        address: tokenAddress,
        abi: abi,
        eventName: "Transfer",
        args: { from: account.address },
        onLogs: logs => {
          console.log(logs);
          setIsConfirmed(true);
          setIsLoading(false);
        },
      });
      console.log(unwatch);
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
  }, [isSent, isConfirmed]);

  return (
    <>
      <span className="w-1/2 mb-5">
        <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
      </span>
      <span className="w-1/2 mb-5">
        <ERC20Input value={amount} onChange={amount => setAmount(amount)} placeholder="#" />
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
