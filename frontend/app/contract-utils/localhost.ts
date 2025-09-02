// chains/localhost.ts
import { Chain } from 'wagmi/chains';

export const localhost: Chain = {
  id: 31337, // or 1337 depending on your local node
  name: 'Localhost',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Local Explorer',
      url: 'http://localhost:3000', // optional
    },
  },
  testnet: true,
};
