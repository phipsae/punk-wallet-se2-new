import { useState } from "react";
import Image from "next/image";
import { Tokens } from "../Tokens";
import { useSharedState } from "~~/sharedStateContext";

interface TokenDropdownProps {
  networkName: string;
}

export const TokenMenu = ({ networkName }: TokenDropdownProps) => {
  const erc20Tokens = Tokens[String(networkName)].erc20Tokens;
  const nativeToken = Tokens[String(networkName)].nativeToken;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    selectedTokenName,
    selectedTokenImage,
    setSelectedTokenAddress,
    setSelectedTokenName,
    setSelectedTokenImage,
  } = useSharedState();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (tokenAddress: string, tokenName: string, tokenImage: string) => {
    setSelectedTokenAddress(tokenAddress);
    setSelectedTokenName(tokenName);
    setSelectedTokenImage(tokenImage);
    toggleDropdown();
  };

  return (
    <>
      <div className="dropdown">
        <button tabIndex={0} className="btn btn-active  m-1" onClick={toggleDropdown}>
          <Image src={selectedTokenImage} alt="Avatar Tailwind CSS Component" width={30} height={30} />
          {selectedTokenName}
        </button>
        {isDropdownOpen && (
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
            <li>
              <a onClick={() => handleCheckboxChange("nativeToken", nativeToken.name, nativeToken.imgSrc)}>
                <Image src={nativeToken.imgSrc} alt="Avatar Tailwind CSS Component" width={30} height={30} />
                {nativeToken.name}
              </a>
            </li>
            {erc20Tokens.map((token, index) => (
              <li key={index}>
                <a onClick={() => handleCheckboxChange(token.address, token.name, token.imgSrc)}>
                  <Image src={token.imgSrc} alt="Avatar Tailwind CSS Component" width={30} height={30} />
                  {token.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
