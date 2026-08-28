'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Asset, AssetMintRequest, AssetTransferRequest } from '@/types/did';

interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  mintAsset: (request: AssetMintRequest) => Promise<Asset>;
  transferAsset: (tokenId: string, request: AssetTransferRequest) => Promise<Asset>;
  verifyAsset: (tokenId: string) => Promise<{ valid: boolean; owner: string }>;
  fetchAssets: () => Promise<void>;
}

export function useAssets(): UseAssetsReturn {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintAsset = useCallback(async (request: AssetMintRequest): Promise<Asset> => {
    setLoading(true);
    setError(null);
    try {
      // Create a dummy file for the API
      const dummyFile = new File([''], 'document.pdf', { type: 'application/pdf' });
      const result = await api.mintAsset(dummyFile, request.asset_type, '', undefined) as any;
      const asset = result.asset as Asset;
      setAssets(prev => [...prev, asset]);
      return asset;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mint asset';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const transferAsset = useCallback(async (tokenId: string, request: AssetTransferRequest): Promise<Asset> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.transferAsset(parseInt(tokenId), request.to_address) as any;
      const asset = result.asset as Asset;
      setAssets(prev => prev.map(a => a.token_id === tokenId ? asset : a));
      return asset;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to transfer asset';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyAsset = useCallback(async (tokenId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.verifyAsset(parseInt(tokenId)) as any;
      return { valid: result.valid, owner: result.owner };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify asset';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listAssets() as any;
      setAssets(result.assets || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch assets';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assets,
    loading,
    error,
    mintAsset,
    transferAsset,
    verifyAsset,
    fetchAssets,
  };
}
