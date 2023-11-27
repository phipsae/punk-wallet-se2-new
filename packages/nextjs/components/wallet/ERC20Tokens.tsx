import Image from "next/image";
import { ERC20TokenBalance } from "./ERC20TokenBalance";
import { NativeTokenBalance } from "./NativeTokenBalance";
import { Tokens } from "./Tokens";
import { useSharedState } from "~~/sharedStateContext";

interface ERC20TokensProps {
  networkName: string;
  address: string;
}

export const ERC20Tokens = ({ networkName, address }: ERC20TokensProps) => {
  const erc20Tokens = Tokens[String(networkName)].erc20Tokens;
  const nativeToken = Tokens[String(networkName)].nativeToken;
  const { selectedTokenAddress, setSelectedTokenAddress } = useSharedState(); // Initialize with native token's address
  const { setSelectedTokenName } = useSharedState();

  const handleCheckboxChange = (tokenAddress: string, tokenName: string) => {
    setSelectedTokenAddress(tokenAddress);
    setSelectedTokenName(tokenName);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Token</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {/* Native Token Row */}
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={selectedTokenAddress === "nativeToken"}
                    onChange={() => handleCheckboxChange("nativeToken", nativeToken.name)}
                  />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <Image src={nativeToken.imgSrc} alt="Avatar Tailwind CSS Component" width={500} height={500} />
                    </div>
                  </div>
                  <div className="font-bold">{nativeToken.name}</div>
                </div>
              </td>
              <td>
                <div className="font-bold">
                  <NativeTokenBalance address={address} networkName={networkName} />
                </div>
              </td>
            </tr>
            {/* ERC20 Row */}
            {erc20Tokens.map(token => (
              <tr key={token.address}>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={selectedTokenAddress === token.address}
                      onChange={() => handleCheckboxChange(token.address, token.name)}
                    />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image src={token.imgSrc} alt="Avatar Tailwind CSS Component" width={500} height={500} />
                      </div>
                    </div>
                    <div className="font-bold">{token.name}</div>
                  </div>
                </td>
                <td>
                  <div className="font-bold">
                    <ERC20TokenBalance networkName={networkName} tokenAddress={token.address} address={address} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
