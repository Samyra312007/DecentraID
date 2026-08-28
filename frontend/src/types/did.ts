export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

export interface DIDDocument {
  id: string;
  did: string;
  name?: string;
  controller: string;
  verificationMethod?: VerificationMethod[];
  verification_methods: string[];
  authentication?: string[];
  assertionMethod?: string[];
  services?: DIDService[];
  created_at: string;
  updated_at: string;
  status: 'active' | 'suspended' | 'deactivated';
}

export interface DIDService {
  id: string;
  type: string;
  serviceEndpoint: string;
}

export interface DIDCreateRequest {
  controller: string;
  name?: string;
  did: string;
  document: {
    '@context': string[];
    id: string;
    controller: string;
    authentication: { type: string; publicKeyHex: string }[];
    service?: { id: string; type: string; serviceEndpoint: string }[];
  };
  verification_methods: string[];
  services?: { id: string; type: string; service_endpoint: string }[];
}

export interface DIDUpdateRequest {
  name?: string;
  services?: DIDService[];
}

export interface Asset {
  token_id: string;
  name: string;
  asset_type: string;
  issuer_address: string;
  owner_address: string;
  metadata?: {
    description?: string;
    image?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AssetMintRequest {
  name: string;
  description?: string;
  asset_type: string;
  metadata?: {
    description?: string;
    image?: string;
  };
  issuer_address: string;
  owner_address: string;
}

export interface AssetTransferRequest {
  to_address: string;
}

export interface AnomalyAlert {
  id: string;
  userDID: string;
  riskScore: number;
  severity: 'normal' | 'low' | 'medium' | 'high' | 'critical';
  anomalyType: string;
  description: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface AccessRequest {
  id: string;
  requester_address: string;
  resource_id: string;
  resource_type: string;
  requested_action: string;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  updated_at: string;
}

export interface AccessDecision {
  request_id: string;
  approved: boolean;
  reason?: string;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason: string;
}

export interface AccessLog {
  id: string;
  requester: string;
  resource: string;
  action: string;
  result: 'allowed' | 'denied';
  timestamp: string;
}

export interface Policy {
  policyId: string;
  resourceType: string;
  action: string;
  allowedRoles: string[];
  conditions: AttributeCondition[];
  validUntil: number;
  active: boolean;
}

export interface AttributeCondition {
  attributeKey: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'contains';
  values: string[];
}
