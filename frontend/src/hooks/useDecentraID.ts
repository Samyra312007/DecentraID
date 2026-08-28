'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { api } from '@/lib/api';
import { connectWallet } from '@/lib/web3';
import type { DIDDocument, Asset, AnomalyAlert } from '@/types/did';

const POLYGON_AMOY_CHAIN_ID = 80002;

export function useDecentraID() {
  const [did, setDID] = useState<DIDDocument | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);

  const connectWalletHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const wallet = await connectWallet();
      if (!wallet) throw new Error('MetaMask not installed');

      // Get chain ID
      const chainIdHex = await wallet.provider.send('eth_chainId', []);
      const chainIdNum = parseInt(chainIdHex, 16);
      setChainId(chainIdNum);

      // Sign message for authentication
      const signature = await wallet.signer.signMessage('Authenticate with DecentraID');

      // Login to get JWT
      const loginResponse = await api.login(wallet.address, signature);

      setToken(loginResponse.access_token);
      setAddress(wallet.address);
      setConnected(true);
      api.setToken(loginResponse.access_token);

      // Fetch DID
      try {
        const didResponse: any = await api.resolveDID(loginResponse.did);
        setDID(didResponse.document);
      } catch {
        // DID doesn't exist yet - that's okay
      }

      // Fetch assets and alerts
      await fetchAssets(loginResponse.access_token);
      await fetchAlerts(loginResponse.access_token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setToken(null);
    setAddress(null);
    setConnected(false);
    setChainId(null);
    setDID(null);
    setAssets([]);
    setAlerts([]);
    api.setToken(null);
  }, []);

  const isCorrectNetwork = chainId === POLYGON_AMOY_CHAIN_ID;

  const fetchAssets = useCallback(async (authToken?: string) => {
    const useToken = authToken || token;
    if (!useToken) return;

    try {
      api.setToken(useToken);
      const response: any = await api.listAssets();
      setAssets(response.assets || []);
    } catch (err) {
      console.error('Failed to fetch assets:', err);
    }
  }, [token]);

  const fetchAlerts = useCallback(async (authToken?: string) => {
    const useToken = authToken || token;
    if (!useToken) return;

    try {
      api.setToken(useToken);
      const response: any = await api.getAnomalyAlerts();
      setAlerts(response.alerts || []);
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, [token]);

  const mintAsset = useCallback(async (params: {
    file: File;
    assetType: string;
    jurisdiction: string;
    expiresAt?: number;
  }) => {
    if (!token) throw new Error('Not authenticated');

    setLoading(true);
    try {
      api.setToken(token);
      const result: any = await api.mintAsset(
        params.file,
        params.assetType,
        params.jurisdiction,
        params.expiresAt
      );
      await fetchAssets();
      return result;
    } finally {
      setLoading(false);
    }
  }, [token, fetchAssets]);

  const requestAccess = useCallback(async (
    resourceId: string,
    action: string,
    reason: string
  ) => {
    if (!token) throw new Error('Not authenticated');

    api.setToken(token);
    return api.requestAccess(resourceId, action, reason);
  }, [token]);

  // WebSocket for real-time events
  useEffect(() => {
    if (!token) return;

    const wsUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
      .replace('http', 'ws') + '/ws/events';

    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'anomaly_alert') {
        setAlerts((prev) => [data.data, ...prev]);
      }

      if (data.type === 'access_granted' || data.type === 'access_denied') {
        fetchAssets();
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  }, [token, fetchAssets]);

  return {
    did,
    assets,
    alerts,
    loading,
    error,
    token,
    address,
    connected,
    chainId,
    isCorrectNetwork,
    connectWallet: connectWalletHandler,
    disconnectWallet,
    fetchAssets,
    fetchAlerts,
    mintAsset,
    requestAccess,
  };
}
