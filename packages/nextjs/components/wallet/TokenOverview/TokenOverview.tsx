import { useEffect } from "react";
import Image from "next/image";
import { Tokens } from "../Tokens";
import { ERC20TokenBalance } from "./ERC20TokenBalance";
import { NativeTokenBalance } from "./NativeTokenBalance";
import { useSharedState } from "~~/sharedStateContext";

interface TokenOverviewProps {
  networkName: string;
  address: string;
}

export const TokenOverview = ({ networkName, address }: TokenOverviewProps) => {
  const erc20Tokens = Tokens[String(networkName)].erc20Tokens;
  const nativeToken = Tokens[String(networkName)].nativeToken;
  const blockExplorer = Tokens[String(networkName)].blockExplorer;
  const {
    selectedTokenAddress,
    setSelectedTokenAddress,
    setSelectedTokenName,
    setSelectedTokenImage,
    setSelectedBlockExplorer,
  } = useSharedState(); // Initialize with native token's address

  const handleCheckboxChange = (tokenAddress: string, tokenName: string, tokenImage: string) => {
    setSelectedTokenAddress(tokenAddress);
    setSelectedTokenName(tokenName);
    setSelectedTokenImage(tokenImage);
    setSelectedBlockExplorer(blockExplorer);
  };

  useEffect(() => {
    // Set initial selected token to the native token when the component mounts
    setSelectedTokenAddress("nativeToken");
    setSelectedTokenName(nativeToken.name);
    setSelectedTokenImage(nativeToken.imgSrc);
    setSelectedBlockExplorer(blockExplorer);
  }, [
    nativeToken,
    setSelectedTokenAddress,
    setSelectedTokenName,
    setSelectedTokenImage,
    setSelectedBlockExplorer,
    blockExplorer,
  ]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table w-full ">
          {/* head */}
          <thead>
            <tr>
              <th className="w-1/5">Select</th>
              <th className="w-2/5">Token</th>
              <th className="w-2/5">Balance</th>
            </tr>
          </thead>
        </table>
        <div style={{ maxHeight: "380px", overflowY: "auto" }}>
          <table className="table w-full ">
            <tbody>
              {/* Native Token Row */}
              <tr>
                <th className="w-1/5">
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedTokenAddress === "nativeToken"}
                      onChange={() => handleCheckboxChange("nativeToken", nativeToken.name, nativeToken.imgSrc)}
                    />
                  </label>
                </th>
                <td className="w-2/5">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={nativeToken.imgSrc} alt="Avatar Tailwind CSS Component" width={500} height={500} />
                      </div>
                    </div>
                    <div className="font-bold">{nativeToken.name}</div>
                  </div>
                </td>
                <td className="w-2/5">
                  <div className="font-bold">
                    <NativeTokenBalance address={address} networkName={networkName} />
                  </div>
                </td>
              </tr>
              {/* ERC20 Row */}
              {erc20Tokens.map(token => (
                <tr key={token.address}>
                  <th className="w-1/5">
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={selectedTokenAddress === token.address}
                        onChange={() => handleCheckboxChange(token.address, token.name, token.imgSrc)}
                      />
                    </label>
                  </th>
                  <td className="w-2/5">
                    <div className="flex gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <Image src={token.imgSrc} alt="Avatar Tailwind CSS Component" width={500} height={500} />
                        </div>
                      </div>
                      <div className="font-bold">{token.name}</div>
                    </div>
                  </td>
                  <td className="w-2/5">
                    <div className="font-bold">
                      <ERC20TokenBalance networkName={networkName} tokenAddress={token.address} address={address} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
