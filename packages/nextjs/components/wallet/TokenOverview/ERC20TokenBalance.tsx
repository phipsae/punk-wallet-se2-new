import { useEffect, useState } from "react";
import { useCallback } from "react";
import { publicClientSelector } from "../publicClientSelector";
import { formatUnits } from "viem";
import { parseAbi } from "viem";
import { useSharedState } from "~~/sharedStateContext";

interface ERC20TokensProps {
  networkName: string;
  address: string;
  tokenAddress: string;
  refreshCount: number;
}

const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
]);

export const ERC20TokenBalance = ({ networkName, tokenAddress, address, refreshCount }: ERC20TokensProps) => {
  const [balance, setBalance] = useState(0);
  const { isConfirmed } = useSharedState();

  const publicClient = publicClientSelector(networkName);

  const getBalance = useCallback(async () => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: tokenAddress,
          abi: abi,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(Number(data));
        console.log(refreshCount);
      }
    } catch (error) {
      console.log(error);
    }
  }, [publicClient, address, tokenAddress, refreshCount]);

  useEffect(() => {
    getBalance();
    if (isConfirmed) {
      getBalance();
    }
  }, [refreshCount, getBalance, isConfirmed]);

  return (
    <>
      <div>{formatUnits(BigInt(balance), 18).slice(0, 6)}</div>
      {/* <div>{formatUnits(formatEther(BigInt(balance)), 9)}</div> */}
    </>
  );
};
