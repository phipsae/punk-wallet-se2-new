import type { NextPage } from "next";
import { privateKeyToAccount } from "viem/accounts";
import { ERC20Tokens } from "~~/components/wallet/ERC20Tokens";
import { NativeTokenBalance } from "~~/components/wallet/NativeTokenBalance";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`);
  const { selectedChain } = useSharedState();
  //   const result = BalanceGet(account.address, "mainnet");

  //   console.log(account.address);

  return (
    <>
      Address: {account.address}
      <NetworkMenu />
      <ERC20Tokens networkName={selectedChain} address={account.address} />
      <button
        onClick={() => {
          //   console.log(result);
        }}
      >
        {" "}
        Click Me
      </button>
      Balance : <NativeTokenBalance address={account.address} networkName={selectedChain} />
    </>
  );
};

export default Wallet;
