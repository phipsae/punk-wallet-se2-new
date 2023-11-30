import { useState } from "react";
import { Tokens } from "./Tokens";
import { useSharedState } from "~~/sharedStateContext";

export const NetworkMenu = () => {
  const networks = ["sepolia", "mainnet", "arbitrum", "optimism"];
  const { selectedChain, setSelectedChain } = useSharedState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const color = Tokens[String(selectedChain)].color;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNetworkSelect = (selectedChain: string) => {
    setSelectedChain(selectedChain);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <div className="dropdown">
        <label
          tabIndex={0}
          className="btn btn-active btn-neutral m-1 w-1/12"
          onClick={toggleDropdown}
          style={{ backgroundColor: color }}
        >
          {selectedChain}
        </label>
        {isDropdownOpen && (
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            {networks.map((network, index) => (
              <li key={index}>
                <a onClick={() => handleNetworkSelect(network)}>{network}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
