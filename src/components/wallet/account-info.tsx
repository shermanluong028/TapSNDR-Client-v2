"use client";

import { useWallet } from "./wallet-provider";
// import { Card, CardContent } from "@/components/ui/card";

export default function AccountInfo() {
  const { account, chainId, balance, isConnected } = useWallet();

  if (!isConnected) {
    return null;
  }

  // Format account address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  // Get network name from chain ID
  const getNetworkName = (chainId: number) => {
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

  return (
    // <Card className="w-full">
    //   <CardContent className="pt-6">
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Account</h3>
        <p className="mt-1 text-sm font-mono">{formatAddress(account!)}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Network</h3>
        <p className="mt-1 text-sm">
          {chainId ? getNetworkName(chainId) : "Unknown"}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500">Balance</h3>
        <p className="mt-1 text-sm">
          {balance ? `${Number.parseFloat(balance).toFixed(4)} ETH` : "Unknown"}
        </p>
      </div>
    </div>
    //   </CardContent>
    // </Card>
  );
}
