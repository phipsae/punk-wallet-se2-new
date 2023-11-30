import { useEffect, useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { formatEther } from "viem";
import { parseAbi } from "viem";
import { useSharedState } from "~~/sharedStateContext";

interface ERC20TokensProps {
  networkName: string;
  address: string;
  tokenAddress: string;
}

const abi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
]);

export const ERC20TokenBalance = ({ networkName, tokenAddress, address }: ERC20TokensProps) => {
  const [balance, setBalance] = useState(0);
  const { isConfirmed } = useSharedState();

  const publicClient = publicClientSelector(networkName);

  const getBalance = async () => {
    try {
      if (publicClient) {
        const data = await publicClient.readContract({
          address: tokenAddress,
          abi: abi,
          functionName: "balanceOf",
          args: [address],
        });
        setBalance(Number(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBalance();
    if (isConfirmed) {
      getBalance();
    }
  });

  return (
    <>
      <div>{formatEther(BigInt(balance))}</div>
    </>
  );
};
