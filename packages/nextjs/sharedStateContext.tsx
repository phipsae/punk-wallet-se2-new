import { ReactNode, createContext, useContext, useState } from "react";

interface SharedStateContextProps {
  selectedChain: string;
  setSelectedChain: (value: string) => void;
  selectedTokenAddress: string;
  setSelectedTokenAddress: (value: string) => void;
  selectedTokenName: string;
  setSelectedTokenName: (value: string) => void;
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<string>("mainnet");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("nativeToken");
  const [selectedTokenName, setSelectedTokenName] = useState<string>("ETH");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  return (
    <SharedStateContext.Provider
      value={{
        selectedChain,
        setSelectedChain,
        selectedTokenAddress,
        setSelectedTokenAddress,
        selectedTokenName,
        setSelectedTokenName,
        isConfirmed,
        setIsConfirmed,
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
