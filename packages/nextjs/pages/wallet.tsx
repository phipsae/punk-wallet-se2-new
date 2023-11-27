import type { NextPage } from "next";
import { QRCodeSVG } from "qrcode.react";
import { privateKeyToAccount } from "viem/accounts";
import { ERC20Tokens } from "~~/components/wallet/ERC20Tokens";
import { NetworkMenu } from "~~/components/wallet/NetworkMenu";
import { SelectedTokenBalance } from "~~/components/wallet/SelectedTokenBalance";
import { useSharedState } from "~~/sharedStateContext";

const Wallet: NextPage = () => {
  const account = privateKeyToAccount(`0x${process.env.NEXT_PUBLIC_PRIVATE_KEY_WALLET}`);
  const { selectedChain } = useSharedState();
  const { selectedTokenAddress, selectedTokenName } = useSharedState();

  return (
    <>
      <div className="container mx-auto flex flex-col mt-5">
        <NetworkMenu />
        <div className="flex flex-row gap-5">
          <div className="flex flex-col flex-1 mt-5 border p-5">
            Balance in {selectedTokenName}:{" "}
            <SelectedTokenBalance
              address={account.address}
              networkName={selectedChain}
              tokenAddress={selectedTokenAddress}
            />
            <QRCodeSVG value={account.address} />
            Address: {account.address}
          </div>
          <div className="flex flex-col flex-1 mt-5 border p-5 ">
            <ERC20Tokens networkName={selectedChain} address={account.address} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Wallet;
