import { useEffect, useState } from "react";
import { publicClientSelector } from "../publicClientSelector";
import { formatUnits } from "viem";
import { useSharedState } from "~~/sharedStateContext";

interface NativeTokenBalanceProps {
  address: string;
  networkName: string;
  refreshCount: number;
}

export const NativeTokenBalance = ({ address, networkName, refreshCount }: NativeTokenBalanceProps) => {
  const [balance, setBalance] = useState(BigInt(0));
  const { isConfirmed } = useSharedState();

  useEffect(() => {
    const fetchBalance = async () => {
      const publicClient = publicClientSelector(networkName);
      if (publicClient) {
        const fetchedBalance = await publicClient.getBalance({ address });
        setBalance(fetchedBalance);
      }
      console.log(refreshCount);
    };
    if (address) {
      fetchBalance();
      if (isConfirmed) {
        fetchBalance();
      }
    }
  }, [address, networkName, isConfirmed, refreshCount]);

  return (
    <>
      <span className="text-right">{formatUnits(BigInt(balance), 18).slice(0, 6)}</span>
    </>
  );
};
