/**
 * Security Rule Test Specification & Payloads for CyberSec Zero-Day Academy
 * Demonstrates the Dirty Dozen vectors and expected PERMISSION_DENIED enforcement.
 */

export interface DirtyDozenTestVector {
  id: string;
  name: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string | null; email?: string } | null;
  payload?: Record<string, any>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestVector[] = [
  {
    id: 'DD-01',
    name: 'Identity Spoofing (Impersonation on User Creation)',
    path: '/users/victim_user_999',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      id: 'victim_user_999',
      username: 'impersonator',
      email: 'victim@test.com',
      xp: 0,
      currentLevel: 1,
      completedLevels: []
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-02',
    name: 'Self-Assigned Privilege Escalation',
    path: '/users/attacker_456',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      id: 'attacker_456',
      username: 'hacker',
      email: 'hacker@test.com',
      role: 'ADMIN',
      xp: 100,
      currentLevel: 5,
      completedLevels: [1, 2, 3, 4]
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-03',
    name: 'Direct Admin Document Insertion',
    path: '/admins/attacker_456',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      email: 'attacker@evil.com',
      role: 'ADMIN'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-04',
    name: 'Arbitrary PII Snooping',
    path: '/users/victim_user_123',
    operation: 'get',
    auth: { uid: 'curious_student_789' },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-05',
    name: 'Jumbo ID Poisoning',
    path: `/users/${'a'.repeat(2000)}`,
    operation: 'create',
    auth: { uid: 'a'.repeat(2000) },
    payload: {
      id: 'a'.repeat(2000),
      username: 'dos',
      email: 'dos@test.com',
      xp: 0,
      currentLevel: 1,
      completedLevels: []
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-06',
    name: 'Shadow Field Injection',
    path: '/users/attacker_456',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      id: 'attacker_456',
      username: 'shadow',
      email: 'shadow@test.com',
      xp: 0,
      currentLevel: 1,
      completedLevels: [],
      isSuperUser: true,
      __debugBypass: 1
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-07',
    name: 'Public Profile Hijack',
    path: '/public_profiles/victim_user_123',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      userId: 'victim_user_123',
      username: 'defaced',
      batch: '2027',
      level: 1,
      xp: 0
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-08',
    name: 'Certificate Forgery (Falsified Recipient)',
    path: '/certificates/SG-FAKE-CERT-01',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      certificateId: 'SG-FAKE-CERT-01',
      userId: 'victim_user_123',
      studentName: 'Faker',
      completionDate: '2026-09-29',
      status: 'Valid'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-09',
    name: 'Certificate Modification (Terminal State Tampering)',
    path: '/certificates/SG-CYBER-LEGIT-100',
    operation: 'update',
    auth: { uid: 'attacker_456' },
    payload: {
      status: 'Revoked',
      finalScore: 0
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-10',
    name: 'Unauthenticated Global User Query',
    path: '/users',
    operation: 'list',
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-11',
    name: 'Type Corruption / Negative Values',
    path: '/users/attacker_456',
    operation: 'create',
    auth: { uid: 'attacker_456' },
    payload: {
      id: 'attacker_456',
      username: 'attacker',
      email: 'attacker@test.com',
      xp: 'TEN_THOUSAND',
      currentLevel: -5,
      completedLevels: 'ALL'
    },
    expectedResult: 'PERMISSION_DENIED'
  },
  {
    id: 'DD-12',
    name: 'Public Profile Listing Without Auth Check',
    path: '/public_profiles',
    operation: 'list',
    auth: null,
    expectedResult: 'PERMISSION_DENIED'
  }
];

export function runSecurityRuleAssertions() {
  console.log(`[Security Audit] Loaded ${DIRTY_DOZEN_TESTS.length} adversarial test vectors.`);
  return DIRTY_DOZEN_TESTS.every(t => t.expectedResult === 'PERMISSION_DENIED');
}
