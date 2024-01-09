interface NetworkData {
  name: string;
  color: string;
  chainId: number;
  price: string;
  blockExplorer: string;
  erc20Tokens: {
    name: string;
    address: string;
    decimals: number;
    imgSrc: string;
  }[];
  nativeToken: {
    name: string;
    imgSrc: string;
  };
}

interface TokensType {
  [key: string]: NetworkData;
}
export const Tokens: TokensType = {
  mainnet: {
    name: "ethereum",
    color: "#12100B",
    chainId: 1,
    price: "uniswap",
    // rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/" + ALCHEMY_API_KEY_MAINNET,
    blockExplorer: "https://etherscan.io/",
    erc20Tokens: [
      {
        name: "WETH",
        address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        decimals: 18,
        imgSrc: "/WETH.png",
      },
      {
        name: "ENS",
        address: "0xc18360217d8f7ab5e7c516566761ea12ce7f9d72",
        decimals: 18,
        imgSrc: "/ENS.png",
      },
      {
        name: "GTC",
        address: "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        decimals: 18,
        imgSrc: "/GTC.png",
      },
      {
        name: "BAL",
        address: "0xba100000625a3754423978a60c9317c58a424e3d",
        decimals: 18,
        imgSrc: "/BAL.png",
      },
      {
        name: "EURe",
        address: "0x3231cb76718cdef2155fc47b5286d82e6eda273f",
        decimals: 18,
        imgSrc: "/EURe.png",
      },
      {
        name: "USDC",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        imgSrc: "/USDC.png",
      },
      {
        name: "USDT",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        decimals: 6,
        imgSrc: "/USDT.png",
      },
      {
        name: "DAI",
        address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },
  optimism: {
    name: "optimism",
    color: "#f01a37",
    price: "uniswap",
    chainId: 10,
    blockExplorer: "https://optimistic.etherscan.io/",
    // rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/gzr_xuzv2SPwbPchC9Z41qmfodlDglKp`,
    erc20Tokens: [
      {
        name: "OP",
        address: "0x4200000000000000000000000000000000000042",
        decimals: 18,
        imgSrc: "/OP.png",
      },
      {
        name: "USDC",
        address: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
        decimals: 6,
        imgSrc: "/USDC.png",
      },
      {
        name: "USDT",
        address: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
        decimals: 6,
        imgSrc: "/USDT.png",
      },
      {
        name: "DAI",
        address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },
  arbitrum: {
    name: "arbitrum",
    color: "#50a0ea",
    price: "uniswap",
    chainId: 42161,
    blockExplorer: "https://arbiscan.io/",
    // rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/tYM-Tr8c9dHV5a8AgvXnVmS9e-xvoxeM`,
    //gasPrice: 1000000000,// TODO ASK RPC
    erc20Tokens: [
      {
        name: "ARB",
        address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
        decimals: 18,
        imgSrc: "/ARB.png",
      },
      {
        name: "USDC",
        address: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
        decimals: 6,
        imgSrc: "/USDC.png",
      },
      {
        name: "USDT",
        address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
        decimals: 6,
        imgSrc: "/USDT.png",
      },
      {
        name: "DAI",
        address: "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },
  sepolia: {
    name: "sepolia",
    color: "#12100B",
    price: "uniswap",
    chainId: 11155111,
    blockExplorer: "https://sepolia.etherscan.io",
    // rpcUrl: `https://arb-mainnet.g.alchemy.com/v2/tYM-Tr8c9dHV5a8AgvXnVmS9e-xvoxeM`,
    // //gasPrice: 1000000000,// TODO ASK RPC
    erc20Tokens: [
      {
        name: "tDAI",
        address: "0x9ef870fDf44fAD7eF6DBcfaA68BeF95025721Bd7",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },
  goerli: {
    name: "goerli",
    color: "#0975F6",
    price: "uniswap",
    chainId: 5,
    // faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    // rpcUrl: `https://eth-goerli.g.alchemy.com/v2/4vFnzFt4K0gFDvYodzTuH9ZjbGI-awSf`,
    erc20Tokens: [
      {
        name: "tDAI",
        address: "0x9ef870fDf44fAD7eF6DBcfaA68BeF95025721Bd7",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },

  zora: {
    name: "zora",
    color: "#0975F6",
    price: "uniswap",
    chainId: 280,
    // faucet: "https://goerli-faucet.slock.it/",
    blockExplorer: "https://goerli.etherscan.io/",
    // rpcUrl: `https://eth-goerli.g.alchemy.com/v2/4vFnzFt4K0gFDvYodzTuH9ZjbGI-awSf`,
    erc20Tokens: [
      {
        name: "tDAI",
        address: "0x9ef870fDf44fAD7eF6DBcfaA68BeF95025721Bd7",
        decimals: 18,
        imgSrc: "/DAI.png",
      },
    ],
    nativeToken: {
      name: "ETH",
      imgSrc: "/ETH.png",
    },
  },
  polygon: {
    name: "polygon",
    color: "#2bbdf7",
    price: "uniswap:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
    chainId: 137,
    // rpcUrl: "https://polygon-mainnet.g.alchemy.com/v2/7ls4W5wc3Cu-4-Zq2QaQxgUhJKjUIDay",
    // faucet: "https://faucet.matic.network/",
    blockExplorer: "https://polygonscan.com/",
    erc20Tokens: [
      // {
      //   name: "EURe",
      //   address: "0x18ec0A6E18E5bc3784fDd3a3634b31245ab704F6",
      //   decimals: 18,
      //   imgSrc: "/EURe.png",
      // },
      // {
      //   name: "USDC",
      //   address: POLYGON_USDC_ADDRESS,
      //   decimals: 6,
      //   imgSrc: "/USDC.png",
      // },
      // {
      //   name: "USDT",
      //   address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      //   decimals: 6,
      //   imgSrc: "/USDT.png",
      //   NativeMetaTransaction: {
      //     name: "(PoS) Tether USD",
      //     ERC712_VERSION: "1",
      //   },
      // },
      // {
      //   name: "DAI",
      //   address: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
      //   decimals: 18,
      //   imgSrc: "/DAI.png",
      //   NativeMetaTransaction: {
      //     name: "(PoS) Dai Stablecoin",
      //     ERC712_VERSION: "1",
      //   },
      // },
    ],
    nativeToken: {
      name: "MATIC",
      imgSrc: "/MATIC.png",
    },
  },
};
