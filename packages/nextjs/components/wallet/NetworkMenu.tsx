import { useState } from "react";
import { useSharedState } from "~~/sharedStateContext";

export const NetworkMenu = () => {
  const networks = ["sepolia", "mainnet", "arbitrum"];
  const { selectedChain, setSelectedChain } = useSharedState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <label tabIndex={0} className="btn m-1" onClick={toggleDropdown}>
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
