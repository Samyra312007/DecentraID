'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { AccessRequest, AccessDecision, AccessLog, AccessCheckResult } from '@/types/did';

interface UseAccessReturn {
  requests: AccessRequest[];
  logs: AccessLog[];
  loading: boolean;
  error: string | null;
  requestAccess: (resourceId: string, action: string, reason: string) => Promise<AccessRequest>;
  decideAccess: (decision: AccessDecision) => Promise<void>;
  checkAccess: (did: string, resourceId: string, action: string) => Promise<AccessCheckResult>;
  fetchLogs: () => Promise<void>;
}

export function useAccess(): UseAccessReturn {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAccess = useCallback(async (resourceId: string, action: string, reason: string): Promise<AccessRequest> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.requestAccess(resourceId, action, reason) as any;
      setRequests(prev => [...prev, result]);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to request access';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const decideAccess = useCallback(async (decision: AccessDecision) => {
    setLoading(true);
    setError(null);
    try {
      await api.decideAccess(decision.request_id, decision.approved);
      setRequests(prev => prev.map(r =>
        r.id === decision.request_id ? { ...r, status: decision.approved ? 'approved' : 'denied' } : r
      ));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to decide access';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAccess = useCallback(async (did: string, resourceId: string, action: string): Promise<AccessCheckResult> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.checkAccess(did, resourceId, action) as any;
      return { allowed: result.allowed, reason: result.reason || '' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check access';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getAccessLogs() as any;
      setLogs(result.logs || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch logs';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    requests,
    logs,
    loading,
    error,
    requestAccess,
    decideAccess,
    checkAccess,
    fetchLogs,
  };
}
