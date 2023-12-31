import { useEffect, useState } from "react";
import { Tokens } from "./Tokens";
import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";
import { useSharedState } from "~~/sharedStateContext";

export const NetworkMenu = () => {
  const networks = ["sepolia", "mainnet", "arbitrum", "optimism", "goerli"];
  const { selectedChain, setSelectedChain } = useSharedState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const color = Tokens[String(selectedChain)].color;

  const networkMappings: any = {
    sepolia: chains.sepolia,
    mainnet: chains.mainnet,
    arbitrum: chains.arbitrum,
    optimism: chains.optimism,
    goerli: chains.goerli,
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNetworkSelect = (selectedNetworkName: string) => {
    const selectedNetworkConfig = networkMappings[selectedNetworkName];
    if (selectedNetworkConfig) {
      scaffoldConfig.targetNetwork = selectedNetworkConfig;
      setSelectedChain(selectedNetworkName);
      setIsDropdownOpen(false);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedChain", selectedNetworkName);
      }
    } else {
      console.error("Selected network configuration not found");
    }
  };

  useEffect(() => {
    const storedChainName = localStorage.getItem("selectedChain");
    if (storedChainName && networkMappings[storedChainName]) {
      scaffoldConfig.targetNetwork = networkMappings[storedChainName];
      setSelectedChain(storedChainName);
    }
  });

  return (
    <>
      <div className="dropdown">
        <label
          tabIndex={0}
          className="btn btn-active btn-neutral m-1"
          onClick={toggleDropdown}
          style={{ backgroundColor: color }}
        >
          {selectedChain}
        </label>
        {isDropdownOpen && (
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-30">
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
