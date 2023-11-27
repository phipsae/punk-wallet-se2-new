import { ReactNode, createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  selectedChain: string;
  setSelectedChain: (value: string) => void;
  selectedTokenAddress: string;
  setSelectedTokenAddress: (value: string) => void;
  selectedTokenName: string;
  setSelectedTokenName: (value: string) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<string>("mainnet");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("nativeToken");
  const [selectedTokenName, setSelectedTokenName] = useState<string>("ETH");

  return (
    <SharedStateContext.Provider
      value={{
        selectedChain,
        setSelectedChain,
        selectedTokenAddress,
        setSelectedTokenAddress,
        selectedTokenName,
        setSelectedTokenName,
      }}
    >
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
};
