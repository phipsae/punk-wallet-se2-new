import { useEffect, useState } from "react";
import { publicClientSelector } from "../publicClientSelector";
import { formatUnits } from "viem";
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

  return (
    <>
      <span className="text-right">{formatUnits(BigInt(balance), 18).slice(0, 6)}</span>
    </>
  );
};
