'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { DIDDocument, DIDCreateRequest, DIDUpdateRequest } from '@/types/did';

interface UseDIDReturn {
  dids: DIDDocument[];
  currentDID: DIDDocument | null;
  loading: boolean;
  error: string | null;
  createDID: (request: DIDCreateRequest) => Promise<DIDDocument>;
  resolveDID: (did: string) => Promise<DIDDocument>;
  updateDID: (did: string, request: DIDUpdateRequest) => Promise<DIDDocument>;
  refreshDIDs: () => Promise<void>;
}

export function useDID(): UseDIDReturn {
  const [dids, setDIDs] = useState<DIDDocument[]>([]);
  const [currentDID, setCurrentDID] = useState<DIDDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDID = useCallback(async (request: DIDCreateRequest): Promise<DIDDocument> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.createDID(request.controller, { name: request.name }) as any;
      const didDoc = result.document as DIDDocument;
      setDIDs(prev => [...prev, didDoc]);
      setCurrentDID(didDoc);
      return didDoc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create DID';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resolveDID = useCallback(async (did: string): Promise<DIDDocument> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.resolveDID(did) as any;
      const didDoc = result.document as DIDDocument;
      setCurrentDID(didDoc);
      return didDoc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resolve DID';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDID = useCallback(async (did: string, request: DIDUpdateRequest): Promise<DIDDocument> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.updateDID(did, request as any) as any;
      const didDoc = result.document as DIDDocument;
      setDIDs(prev => prev.map(d => d.did === did ? didDoc : d));
      setCurrentDID(didDoc);
      return didDoc;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update DID';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDIDs = useCallback(async () => {
    setLoading(true);
    try {
      if (currentDID) {
        const refreshed = await api.resolveDID(currentDID.did) as any;
        setCurrentDID(refreshed.document as DIDDocument);
      }
    } catch (err) {
      console.error('Failed to refresh DIDs:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDID]);

  return {
    dids,
    currentDID,
    loading,
    error,
    createDID,
    resolveDID,
    updateDID,
    refreshDIDs,
  };
}
