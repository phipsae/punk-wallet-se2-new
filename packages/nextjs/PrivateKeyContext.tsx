// // src/contexts/PrivateKeyContext.tsx
// import React, { ReactNode, createContext, useState } from "react";

// interface PrivateKeyContextProps {
//   selectedPrivateKey: string;
//   setSelectedPrivateKey: (key: string) => void;
// }

// const defaultState = {
//   selectedPrivateKey: "",
//   setSelectedPrivateKey: () => {},
// };

// export const PrivateKeyContext = createContext<PrivateKeyContextProps>(defaultState);

// interface PrivateKeyProviderProps {
//   children: ReactNode;
// }

// export const PrivateKeyProvider: React.FC<PrivateKeyProviderProps> = ({ children }) => {
//   const [selectedPrivateKey, setSelectedPrivateKey] = useState<string>("");

//   return (
//     <PrivateKeyContext.Provider value={{ selectedPrivateKey, setSelectedPrivateKey }}>
//       {children}
//     </PrivateKeyContext.Provider>
//   );
// };
