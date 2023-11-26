import { useEffect, useState } from "react";
import { publicClientSelector } from "./publicClientSelector";
import { formatEther } from "viem";

interface BalanceGetProps {
  address: string;
  networkName: string;
}

export const NativeTokenBalance = ({ address, networkName }: BalanceGetProps) => {
  const [balance, setBalance] = useState(BigInt(0));

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
    }
  }, [address, networkName]);

  return <>{formatEther(balance)}</>;
};

// export const BalanceGet = async (address: string, networkName: string) => {
//   const [balance, setBalance] = useState(BigInt(0));

//   const publicClient = publicClientSelector(networkName);
//   if (publicClient) {
//     const balance = await publicClient.getBalance({
//       address: address,
//     });
//     setBalance(balance);
//   }

//   console.log(balance);

//   return <>{balance}</>;
// };
