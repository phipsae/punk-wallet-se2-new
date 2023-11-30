import { useEffect, useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { formatEther } from "viem";
import { useSharedState } from "~~/sharedStateContext";

interface NativeTokenBalanceProps {
  address: string;
  networkName: string;
}

export const NativeTokenBalance = ({ address, networkName }: NativeTokenBalanceProps) => {
  const [balance, setBalance] = useState(BigInt(0));
  const { isConfirmed } = useSharedState();

  useEffect(() => {
    const fetchBalance = async () => {
      const publicClient = publicClientSelector(networkName);
      if (publicClient) {
        const fetchedBalance = await publicClient.getBalance({ address });
        setBalance(fetchedBalance);
      }
    };

    if (address) {
      fetchBalance();
      if (isConfirmed) {
        fetchBalance();
      }
    }
  }, [address, networkName, isConfirmed]);

  return <>{formatEther(balance)}</>;
};
