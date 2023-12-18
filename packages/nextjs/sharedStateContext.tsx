import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface SharedStateContextProps {
  selectedChain: string;
  setSelectedChain: (value: string) => void;
  selectedTokenAddress: string;
  setSelectedTokenAddress: (value: string) => void;
  selectedTokenImage: string;
  setSelectedTokenImage: (value: string) => void;
  selectedTokenName: string;
  setSelectedTokenName: (value: string) => void;
  selectedBlockExplorer: string;
  setSelectedBlockExplorer: (value: string) => void;
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
  selectedPrivateKey: string;
  setSelectedPrivateKey: (value: string) => void;
  privateKeys: string[];
  setPrivateKeys: (value: string[]) => void;
  isRainbow: boolean;
  setIsRainbow: (value: boolean) => void;
}

const SharedStateContext = createContext<SharedStateContextProps | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedChain, setSelectedChain] = useState<string>("mainnet");
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>("nativeToken");
  const [selectedTokenName, setSelectedTokenName] = useState<string>("ETH");
  const [selectedTokenImage, setSelectedTokenImage] = useState<string>("/ETH.png");
  const [selectedBlockExplorer, setSelectedBlockExplorer] = useState<string>("https://etherscan.io/");
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>("");
  const [privateKeys, setPrivateKeys] = useState<string[]>([]);
  const [isRainbow, setIsRainbow] = useState<boolean>(false);

  // to retrieve private keys from storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrivateKey = localStorage.getItem("selectedPrivateKey");
      const storedKeys = localStorage.getItem("storedPrivateKeys");
      const storedChain = localStorage.getItem("selectedChain");
      // const storedRainbow = localStorage.getItem("isRainbow");
      try {
        setSelectedPrivateKey(storedPrivateKey ? JSON.parse(storedPrivateKey) : "");
        setSelectedChain(storedChain ? JSON.parse(storedChain) : "");
        setPrivateKeys(storedKeys ? JSON.parse(storedKeys) : []);
        // setIsRainbow(storedRainbow ? JSON.parse(storedRainbow) : false);
      } catch (error) {
        console.error("Error parsing stored keys: ", error);
      }
    }
  }, []);

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
        selectedTokenImage,
        setSelectedTokenImage,
        selectedBlockExplorer,
        setSelectedBlockExplorer,
        selectedPrivateKey,
        setSelectedPrivateKey,
        privateKeys,
        setPrivateKeys,
        isRainbow,
        setIsRainbow,
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
