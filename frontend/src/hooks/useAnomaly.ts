'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { AnomalyAlert } from '@/types/did';

export interface AnomalyDashboard {
  risk_score: number;
  alerts: AnomalyAlert[];
  behavior_patterns: Record<string, any>;
  monitoring_since: string | null;
  total_access_events: number;
}

export interface BehaviorProfile {
  user_id: string;
  total_events: number;
  typical_hour: number;
  typical_day: number;
  top_resources: string[];
  top_actions: string[];
  known_ips: number;
  first_seen: string | null;
  last_seen: string | null;
}

export function useAnomaly() {
  const [dashboard, setDashboard] = useState<AnomalyDashboard | null>(null);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>([]);
  const [profile, setProfile] = useState<BehaviorProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data: any = await api.getAnomalyDashboard();
      setDashboard({
        risk_score: data.risk_score || 0,
        alerts: data.alerts || [],
        behavior_patterns: data.behavior_patterns || {},
        monitoring_since: data.monitoring_since,
        total_access_events: data.total_access_events || 0,
      });
      setAlerts(data.alerts || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch anomaly dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async (severity?: string, limit: number = 100) => {
    setLoading(true);
    setError(null);

    try {
      const data: any = await api.getAnomalyAlerts(severity, limit);
      setAlerts(data.alerts || []);
      return data.alerts || [];
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alerts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      await api.acknowledgeAlert(alertId);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId
            ? { ...alert, acknowledged: true }
            : alert
        )
      );
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to acknowledge alert');
      return false;
    }
  }, []);

  const fetchProfile = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = userId
        ? `/api/v1/anomaly/profile/${userId}`
        : '/api/v1/anomaly/profile';
      const data: any = await api.request(endpoint);
      setProfile({
        user_id: data.user_id,
        total_events: data.total_events || 0,
        typical_hour: data.typical_hour || 0,
        typical_day: data.typical_day || 0,
        top_resources: data.top_resources || [],
        top_actions: data.top_actions || [],
        known_ips: data.known_ips || 0,
        first_seen: data.first_seen,
        last_seen: data.last_seen,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch behavior profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const getRiskColor = useCallback((score: number): string => {
    if (score >= 80) return 'red';
    if (score >= 60) return 'orange';
    if (score >= 40) return 'yellow';
    if (score >= 20) return 'blue';
    return 'green';
  }, []);

  const getRiskLabel = useCallback((score: number): string => {
    if (score >= 80) return 'Critical';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Low';
    return 'Normal';
  }, []);

  const getSeverityColor = useCallback((severity: string): string => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'green';
    }
  }, []);

  return {
    dashboard,
    alerts,
    profile,
    loading,
    error,
    fetchDashboard,
    fetchAlerts,
    acknowledgeAlert,
    fetchProfile,
    getRiskColor,
    getRiskLabel,
    getSeverityColor,
  };
}
