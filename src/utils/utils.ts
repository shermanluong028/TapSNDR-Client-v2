// Format account address for display
export const formatAddress = (address: string) => {
  return ` (${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )})`;
};

// Get network name from chain ID
export const getNetworkName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return "Ethereum Mainnet";
    case 5:
      return "Goerli Testnet";
    case 11155111:
      return "Sepolia Testnet";
    case 137:
      return "Polygon Mainnet";
    case 80001:
      return "Mumbai Testnet";
    default:
      return `Chain ID: ${chainId}`;
  }
};
