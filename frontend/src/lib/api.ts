const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SESSION_KEY = 'decentraid.session';

export interface StoredSession {
  token: string;
  address: string;
  did: string | null;
}

export function loadSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return typeof parsed.token === 'string' && parsed.token.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    let response: Response;
    try {
      response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
      });
    } catch {
      // Network failure: backend not running, CORS blocked, or wrong API URL.
      throw new Error(
        `Cannot reach the API at ${API_BASE}. Is the backend running? Start it with: docker compose up -d backend`
      );
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(address: string, signature: string) {
    return this.request<{ access_token: string; did: string; address: string }>(
      '/api/v1/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ address, signature }),
      }
    );
  }

  // DID
  async createDID(publicKey: string, metadata: Record<string, unknown> = {}) {
    return this.request('/api/v1/did/create', {
      method: 'POST',
      body: JSON.stringify({ public_key: publicKey, metadata }),
    });
  }

  async resolveDID(did: string) {
    return this.request(`/api/v1/did/${did}`);
  }

  async updateDID(did: string, metadata: Record<string, unknown>) {
    return this.request(`/api/v1/did/${did}`, {
      method: 'PUT',
      body: JSON.stringify({ metadata }),
    });
  }

  // Assets
  async mintAsset(file: File, assetType: string, jurisdiction: string, expiresAt?: number) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('asset_type', assetType);
    formData.append('jurisdiction', jurisdiction);
    if (expiresAt) formData.append('expires_at', expiresAt.toString());

    return this.request('/api/v1/asset/mint', {
      method: 'POST',
      body: formData,
    });
  }

  async listAssets() {
    return this.request('/api/v1/asset/list');
  }

  async verifyAsset(tokenId: number) {
    return this.request(`/api/v1/asset/${tokenId}/verify`);
  }

  async transferAsset(tokenId: number, toDid: string) {
    return this.request(`/api/v1/asset/${tokenId}/transfer?to_did=${toDid}`, {
      method: 'POST',
    });
  }

  // Access Control
  async requestAccess(resourceId: string, action: string, reason: string) {
    return this.request('/api/v1/access/request', {
      method: 'POST',
      body: JSON.stringify({ resource_id: resourceId, action, reason }),
    });
  }

  async decideAccess(requestId: string, approve: boolean) {
    return this.request(`/api/v1/access/decide?request_id=${requestId}&approve=${approve}`, {
      method: 'POST',
    });
  }

  async checkAccess(did: string, resourceId: string, action: string) {
    return this.request(
      `/api/v1/access/check?did=${did}&resource_id=${resourceId}&action=${action}`
    );
  }

  async getAccessLogs(did?: string, resourceId?: string, limit: number = 100) {
    const params = new URLSearchParams();
    if (did) params.set('did', did);
    if (resourceId) params.set('resource_id', resourceId);
    params.set('limit', limit.toString());
    return this.request(`/api/v1/access/logs?${params.toString()}`);
  }

  // Policies
  async createPolicy(resourceType: string, action: string, allowedRoles: string[], validUntil?: number) {
    return this.request('/api/v1/policy/create', {
      method: 'POST',
      body: JSON.stringify({
        resource_type: resourceType,
        action,
        allowed_roles: allowedRoles,
        valid_until: validUntil,
      }),
    });
  }

  async listPolicies() {
    return this.request('/api/v1/policy/list');
  }

  async deactivatePolicy(policyId: string) {
    return this.request(`/api/v1/policy/${policyId}`, { method: 'DELETE' });
  }

  // Anomaly Detection
  async getAnomalyDashboard() {
    return this.request('/api/v1/anomaly/dashboard');
  }

  async getAnomalyAlerts(severity?: string, limit: number = 100) {
    const params = new URLSearchParams();
    if (severity) params.set('severity', severity);
    params.set('limit', limit.toString());
    return this.request(`/api/v1/anomaly/alerts?${params.toString()}`);
  }

  // Anomaly Profile
  async getAnomalyProfile(userId?: string) {
    const endpoint = userId
      ? `/api/v1/anomaly/profile/${userId}`
      : `/api/v1/anomaly/profile`;
    return this.request(endpoint);
  }

  async acknowledgeAlert(alertId: string) {
    return this.request(`/api/v1/anomaly/alerts/${alertId}/acknowledge`, {
      method: 'POST',
    });
  }

  // IPFS
  async uploadToIPFS(file: File, assetType: string = 'document') {
    const formData = new FormData();
    formData.append('file', file);
    const params = new URLSearchParams({ asset_type: assetType });
    return this.request(`/api/v1/ipfs/upload?${params.toString()}`, {
      method: 'POST',
      body: formData,
    });
  }
}

export const api = new ApiClient();
