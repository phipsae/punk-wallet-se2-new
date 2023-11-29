import { useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { walletClientSelector } from "./walletClientSelector";
import { parseAbi } from "viem";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth/Input";

interface ERC20TokenTransactionProps {
  account: any;
  selectedChain: any;
  tokenAddress: any;
}

const abi = parseAbi([
  // "function balanceOf(address owner) view returns (uint256)",
  // "event Transfer(address indexed from, address indexed to, uint256 amount)",
  "function transfer(address to, uint256 value) public returns (bool)",
]);

export const ERC20TokenTransaction = ({ account, tokenAddress, selectedChain }: ERC20TokenTransactionProps) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const walletClient = walletClientSelector(selectedChain, account);
  const publicClient = publicClientSelector(selectedChain);

  const txRequest = async () => {
    if (publicClient && walletClient) {
      const response = await publicClient.simulateContract({
        account: account,
        address: tokenAddress,
        abi: abi,
        functionName: "transfer",
        args: [to, BigInt(amount)],
      });

      const requestAny: any = response.request;
      console.log(requestAny);
      await walletClient.writeContract(requestAny);
    }
  };

  return (
    <>
      <span className="w-1/2 mb-5">
        <AddressInput value={to ?? ""} onChange={to => setTo(to)} placeholder="Address Receiver" />
      </span>
      <span className="w-1/2 mb-5">
        <IntegerInput value={amount} onChange={amount => setAmount(amount.toString())} placeholder="#" />
      </span>
      <button
        className="btn btn-primary h-[2.2rem] min-h-[2.2rem] mt-auto"
        onClick={() => {
          txRequest();
        }}
      >
        Send
      </button>
    </>
  );
};
