// =============================================================================
// DecentraID Load Testing Script
// =============================================================================
// Usage: k6 run loadtest.js
// Requires: k6 (https://k6.io/)
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const accessCheckDuration = new Trend('access_check_duration');
const anomalyDetectionDuration = new Trend('anomaly_detection_duration');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up
    { duration: '1m', target: 50 },    // Sustained load
    { duration: '30s', target: 100 },  // Peak load
    { duration: '30s', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // Less than 1% errors
    errors: ['rate<0.01'],
  },
};

// Base URL
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const ANOMALY_URL = __ENV.ANOMALY_URL || 'http://localhost:8001';

// Test data
const TEST_DIDS = [
  'did:decentraid:0x1234567890abcdef1234567890abcdef12345678',
  'did:decentraid:0xabcdef1234567890abcdef1234567890abcdef12',
  'did:decentraid:0x9876543210fedcba9876543210fedcba98765432',
];

const TEST_RESOURCES = [
  'project_alpha',
  'source_code',
  'documentation',
  'config_database',
  'admin_panel',
];

const TEST_ACTIONS = ['read', 'write', 'delete', 'update', 'list'];

// =============================================================================
// Scenario 1: Health Check
// =============================================================================
function testHealthCheck() {
  const res = http.get(`${BASE_URL}/api/v1/health`);
  
  check(res, {
    'health check status 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });
  
  errorRate.add(res.status !== 200);
}

// =============================================================================
// Scenario 2: Access Control Check
// =============================================================================
function testAccessCheck() {
  const did = TEST_DIDS[Math.floor(Math.random() * TEST_DIDS.length)];
  const resource = TEST_RESOURCES[Math.floor(Math.random() * TEST_RESOURCES.length)];
  const action = TEST_ACTIONS[Math.floor(Math.random() * TEST_ACTIONS.length)];
  
  const start = Date.now();
  const res = http.get(
    `${BASE_URL}/api/v1/access/check?did=${did}&resource_id=${resource}&action=${action}`
  );
  const duration = Date.now() - start;
  
  accessCheckDuration.add(duration);
  
  check(res, {
    'access check status 200': (r) => r.status === 200,
    'access check response time < 200ms': (r) => r.timings.duration < 200,
    'access check has granted field': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.granted !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(res.status !== 200);
}

// =============================================================================
// Scenario 3: Anomaly Detection
// =============================================================================
function testAnomalyDetection() {
  const userId = `user_${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`;
  const action = TEST_ACTIONS[Math.floor(Math.random() * TEST_ACTIONS.length)];
  const resource = TEST_RESOURCES[Math.floor(Math.random() * TEST_RESOURCES.length)];
  
  const payload = JSON.stringify({
    user_id: userId,
    action: action,
    resource: resource,
    ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
    success: true,
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const start = Date.now();
  const res = http.post(`${ANOMALY_URL}/detect`, payload, params);
  const duration = Date.now() - start;
  
  anomalyDetectionDuration.add(duration);
  
  check(res, {
    'anomaly detection status 200': (r) => r.status === 200,
    'anomaly detection response time < 200ms': (r) => r.timings.duration < 200,
    'anomaly detection has risk_score': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.risk_score !== undefined && body.risk_score >= 0;
      } catch {
        return false;
      }
    },
    'anomaly detection has severity': (r) => {
      try {
        const body = JSON.parse(r.body);
        return ['normal', 'low', 'medium', 'high', 'critical'].includes(body.severity);
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(res.status !== 200);
}

// =============================================================================
// Scenario 4: DID Resolution
// =============================================================================
function testDIDResolution() {
  const did = TEST_DIDS[Math.floor(Math.random() * TEST_DIDS.length)];
  
  const res = http.get(`${BASE_URL}/api/v1/did/${did}`);
  
  check(res, {
    'DID resolution status 200 or 404': (r) => r.status === 200 || r.status === 404,
    'DID resolution response time < 300ms': (r) => r.timings.duration < 300,
  });
  
  errorRate.add(res.status !== 200 && res.status !== 404);
}

// =============================================================================
// Scenario 5: API Documentation
// =============================================================================
function testAPIDocumentation() {
  const res = http.get(`${BASE_URL}/docs`);
  
  check(res, {
    'API docs status 200': (r) => r.status === 200,
    'API docs response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  errorRate.add(res.status !== 200);
}

// =============================================================================
// Main Test Function
// =============================================================================
export default function () {
  // Weighted random selection of scenarios
  const rand = Math.random();
  
  if (rand < 0.1) {
    testHealthCheck();
  } else if (rand < 0.4) {
    testAccessCheck();
  } else if (rand < 0.7) {
    testAnomalyDetection();
  } else if (rand < 0.9) {
    testDIDResolution();
  } else {
    testAPIDocumentation();
  }
  
  sleep(1);
}

// =============================================================================
// Setup & Teardown
// =============================================================================
export function setup() {
  console.log('Starting DecentraID load test...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Anomaly URL: ${ANOMALY_URL}`);
  
  // Verify services are running
  const healthRes = http.get(`${BASE_URL}/api/v1/health`);
  if (healthRes.status !== 200) {
    console.error('Backend API is not healthy!');
  }
  
  const anomalyRes = http.get(`${ANOMALY_URL}/health`);
  if (anomalyRes.status !== 200) {
    console.error('Anomaly Detection service is not healthy!');
  }
  
  return { startTime: Date.now() };
}

export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Load test completed in ${duration.toFixed(1)}s`);
}
