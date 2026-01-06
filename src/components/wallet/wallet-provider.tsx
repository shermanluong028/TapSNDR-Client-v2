"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { ethers } from "ethers";
import { ERC20_ABI } from "../../config/erc20-abi";
import { NODE_URL } from "../../constants/NodeUrl";
import Web3 from "web3";
import { walletService } from "../../services/wallet.service";
import { useAlert } from "../../contexts/AlertContext";

interface WalletContextType {
  account: string | null;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendUSDT: (to: string, amount: string) => Promise<any>;
  sendUSDC: (to: string, amount: string) => Promise<any>;
  sendUSDTwithPrivateKey: (
    from: string,
    to: string | null,
    amount: string,
    privateKey: string
  ) => Promise<any>;
  refreshBalances: () => Promise<void>;
  isConnected: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// USDT contract addresses for different networks
const USDT_CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  1: "0xdAC17F958D2ee523a2206206994597C13D831ec7", // Mainnet
  // 5: "0x509Ee0d083DdF8AC028f2a56731412edD63223B9", // Goerli
  // 11155111: "0xbdCED8f4c393929a20356372b8A88a386693F353", // Sepolia
  8453 : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    const { ethereum } = window as any;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!isMetaMaskInstalled()) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }

      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);

      // Get network information
      const network = await provider.getNetwork();
      // only accept ethereum mainnet
      const chainId = Number(network.chainId);

      // if (chainId !== 1) {
      if (chainId !== 8453) {
        throw new Error("Please connect to the Base mainnet.");
      }

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];
      setAccount(account);
      setChainId(Number(network.chainId));

      // Get account balance
      const balance = await provider.getBalance(account);
      setBalance(ethers.formatEther(balance));
      
      // Listen for account changes
      ethereum.on("accountsChanged", handleAccountsChanged);

      // Listen for chain changes
      ethereum.on("chainChanged", handleChainChanged);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setError(null);

    // Remove event listeners
    const { ethereum } = window as any;
    if (ethereum && ethereum.removeListener) {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
      ethereum.removeListener("chainChanged", handleChainChanged);
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // Account changed, update state
      setAccount(accounts[0]);

      // Update balance for new account
      try {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const balance = await provider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balance));
      } catch (err) {
        console.error("Error updating balance:", err);
      }
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainId: string) => {
    // window.location.reload();
    setChainId(chainId ? Number(chainId) : null);
    disconnectWallet()
  };

  const getUSDTContract = (provider: ethers.BrowserProvider) => {
    if (!chainId || !USDT_CONTRACT_ADDRESSES[chainId]) {
      throw new Error("USDC not supported on this network");
    }
    return new ethers.Contract(
      USDT_CONTRACT_ADDRESSES[chainId],
      ERC20_ABI,
      provider
    );
  };

  const getUSDCContract = (provider: ethers.BrowserProvider) => {
    if (!chainId || !USDT_CONTRACT_ADDRESSES[chainId]) {
      throw new Error("USDC not supported on this network");
    }
    return new ethers.Contract(
      USDT_CONTRACT_ADDRESSES[chainId],
      ERC20_ABI,
      provider
    );
  };

  const updateBalances = async (
    provider: ethers.BrowserProvider,
    account: string
  ) => {
    try {
      // Native balance
      const nativeBalance = await provider.getBalance(account);
      setBalance(ethers.formatEther(nativeBalance));

      // USDT balance
      if (chainId && USDT_CONTRACT_ADDRESSES[chainId]) {
        const usdtContract = getUSDTContract(provider);
        const balance = await usdtContract.balanceOf(account);
        // setUsdtBalance(ethers.formatUnits(balance, 6)); // USDT uses 6 decimals
      }
    } catch (err) {
      console.error("Error updating balances:", err);
    }
  };

  const sendUSDT = async (to: string, amount: string): Promise<any> => {
    if (!account || !chainId) {
      throw new Error("Wallet not connected");
    }

    interface IERC20 extends ethers.BaseContract {
      transfer(to: string, amount: ethers.BigNumberish): Promise<any>;
    }

    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const usdtContract = getUSDTContract(provider).connect(signer) as IERC20;
      const tx = await usdtContract.transfer(
        to,
        ethers.parseUnits(amount, Number(process.env.USDT_TOKEN_DECIMALS)) // USDT uses 6 decimals
      );

      await tx.wait();
      await refreshBalances(); // Refresh balances after successful transfer

      return tx;
    } catch (err: any) {
      console.error("Error sending USDC:", err);
      setError(err.message || "Failed to send USDC");
      throw err;
    }
  };


  const sendUSDC = async (to: string, amount: string): Promise<any> => {
    if (!account || !chainId) {
      throw new Error("Wallet not connected");
    }
  
    interface IERC20 extends ethers.BaseContract {
      transfer(to: string, amount: ethers.BigNumberish): Promise<any>;
    }
  
    try {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
  
      const usdcContract = getUSDTContract(provider).connect(signer) as IERC20;
      const tx = await usdcContract.transfer(
        to,
        ethers.parseUnits(amount, 6) // USDC uses 6 decimals
      );
  
      await tx.wait();
      await refreshBalances(); // Optional: refresh after send
  
      return tx;
    } catch (err: any) {
      console.error("Error sending USDC:", err);
      setError("Failed to send USDC");
      throw err;
    }
  };
  
  const sendUSDTwithPrivateKey = async (
    from: string,
    to: string | null,
    amount: string,
    privateKey: string
  ): Promise<any> => {
    const web3 = new Web3(NODE_URL);

    const USDTAddress = USDT_CONTRACT_ADDRESSES[11155111];

    // Complete ERC20 ABI including the transfer function
    const ERC20_ABI = [
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    // you're passing the private key just to the local web3js instance
    // it's not broadcasted to the node
    web3.eth.accounts.wallet.add(privateKey);

    async function run() {
      const tokenContract = new web3.eth.Contract(ERC20_ABI, USDTAddress);

      // invoking the `transfer()` function of the contract
      try {
        const transaction = await tokenContract.methods
          .transfer(to, web3.utils.toWei(amount, "ether"))
          .send({ from: from });

        return transaction;
      } catch (err) {
      }
      return "";
    }

    return run();
  };

  const refreshBalances = async () => {
    if (account) {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      await updateBalances(provider, account);
    }
  };

  // Check for existing connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);

        try {
          const network = await provider.getNetwork();
          if (Number(network.chainId) !== 8453) {
            showAlert("error", "Please connect to the Base mainnet.");
            throw new Error("Please connect to the Base mainnet.");
          }

          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const account = accounts[0].address;
            setAccount(account);
      
            setChainId(Number(network.chainId));

            const balance = await provider.getBalance(account);
            setBalance(ethers.formatEther(balance));

            // Set up listeners
            ethereum.on("accountsChanged", handleAccountsChanged);
            ethereum.on("chainChanged", handleChainChanged);
          }
        } catch (err) {
          console.error("Error checking existing connection:", err);
        }
      }
    };

    checkConnection();
    // Cleanup listeners on unmount
    return () => {
      const { ethereum } = window as any;
      if (ethereum && ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  useEffect(() => {
    if(account != null)
      walletService.checkWallet(account)  
  }, [account])
  

  const value = {
    account,
    chainId,
    balance,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    sendUSDT,
    sendUSDTwithPrivateKey,
    sendUSDC,
    refreshBalances,
    isConnected: !!account,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}
