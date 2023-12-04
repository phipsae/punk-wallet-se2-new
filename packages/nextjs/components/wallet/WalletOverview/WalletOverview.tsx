import { useEffect } from "react";
import Image from "next/image";
import { SelectedTokenBalance } from "./SelectedTokenBalance";
import { QRCodeSVG } from "qrcode.react";
import { AddressAdapted } from "~~/components/scaffold-eth/AddressAdapted";

interface WalletOverviewProps {
  account: any;
  chain: string;
  tokenAddress: string;
  tokenName: string;
  tokenImage: string;
  refreshCount: number;
}

export const WalletOverview = ({
  account,
  chain,
  tokenAddress,
  tokenName,
  tokenImage,
  refreshCount,
}: WalletOverviewProps) => {
  useEffect(() => {
    // Code to refresh the component data
  }, [refreshCount]);

  return (
    <>
      <div className="flex flex-row justify-center items-center gap-3 text-2xl font-bold mb-5">
        <Image src={tokenImage} alt="Avatar Tailwind CSS Component" width={50} height={50} />
        {tokenName} Balance:
        <SelectedTokenBalance
          address={account.address}
          networkName={chain}
          tokenAddress={tokenAddress}
          refreshCount={refreshCount}
        />
      </div>
      <div className="flex flex-col items-center mt-5 gap-5">
        <QRCodeSVG value={account.address} width={150} height={150} />
        <AddressAdapted format="long" address={account.address} />
      </div>
    </>
  );
};
