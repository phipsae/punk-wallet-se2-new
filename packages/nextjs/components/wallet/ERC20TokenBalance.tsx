import { useEffect, useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { formatEther } from "viem";
import { parseAbi } from "viem";

interface ERC20TokensProps {
  networkName: string;
  address: string;
  tokenAddress: string;
}

const abi = parseAbi([
  //  ^? const abi: readonly [{ name: "balanceOf"; type: "function"; stateMutability:...
  "function balanceOf(address owner) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 amount)",
]);

export const ERC20TokenBalance = ({ networkName, tokenAddress, address }: ERC20TokensProps) => {
  const [balance, setBalance] = useState(0);

  const publicClient = publicClientSelector(networkName);

  const getBalance = async () => {
    if (publicClient) {
      const data = await publicClient.readContract({
        address: tokenAddress,
        abi: abi,
        functionName: "balanceOf",
        args: [address],
      });
      setBalance(Number(data));
    }
  };

  useEffect(() => {
    getBalance();
  });

  return (
    <>
      <div>{formatEther(BigInt(balance))}</div>
    </>
  );
};
