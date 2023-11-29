import { useState } from "react";
import { walletClientSelector } from "./walletClientSelector";
import { parseEther } from "viem";
import { AddressInput, EtherInput } from "~~/components/scaffold-eth/Input";

interface NativeTokenTransactionProps {
  account: any;
  selectedChain: any;
}

export const NativeTokenTransaction = ({ account, selectedChain }: NativeTokenTransactionProps) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const walletClient = walletClientSelector(selectedChain, account);

  const txRequest = async () => {
    if (walletClient) {
      const transaction = await walletClient.sendTransaction({
        to: to,
        value: parseEther(amount),
      });
      console.log(transaction);
    }
  };

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
        Send
      </button>
    </>
  );
};
