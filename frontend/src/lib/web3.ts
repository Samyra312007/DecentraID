import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function getProvider(): Promise<ethers.BrowserProvider | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = await getProvider();
  if (!provider) return null;
  return provider.getSigner();
}

export async function connectWallet(): Promise<{ address: string; signer: ethers.JsonRpcSigner; provider: ethers.BrowserProvider } | null> {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { address, signer, provider };
}

export async function signMessage(message: string): Promise<string> {
  const signer = await getSigner();
  if (!signer) throw new Error('Not connected');
  return signer.signMessage(message);
}

export async function getBalance(address: string): Promise<string> {
  const provider = await getProvider();
  if (!provider) return '0';
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}
