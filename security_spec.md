# Security Specification: CyberSec Zero-Day Academy

## 1. Data Invariants
1. **User Identity Invariant**: A user document in `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. **PII Isolation Invariant**: Sensitive PII fields (email, real legal name, birth date, country) are stored exclusively in `/users/{userId}` and can only be read by the owner or an admin. Public leaderboards read from `/public_profiles/{userId}`, which contains zero PII.
3. **Role Escalation Invariant**: A standard user cannot elevate their own role to 'ADMIN' or modify administrative rights. Only validated admins defined in `/admins/{adminId}` have administrative authority.
4. **Certificate Integrity Invariant**: Certificates in `/certificates/{certificateId}` are verifiable by anyone (public read for validation), but can only be issued by the student completing all levels for their own UID, and cannot be updated once issued (terminal state).
5. **Path Variable Hardening Invariant**: All document IDs (`userId`, `certificateId`, `adminId`) must pass regex checks (`^[a-zA-Z0-9_-]+$`) and length constraints (<= 128 characters).

---

## 2. The Dirty Dozen Payloads (Designed to Fail)

### Payload 1: Identity Spoofing (Impersonation on User Creation)
- **Path**: `/users/victim_user_999`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"id": "victim_user_999", "username": "impersonator", "email": "victim@test.com", "xp": 0, "currentLevel": 1, "completedLevels": []}`
- **Expected Outcome**: `PERMISSION_DENIED` (auth.uid does not match path and id).

### Payload 2: Self-Assigned Privilege Escalation
- **Path**: `/users/attacker_456`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"id": "attacker_456", "username": "hacker", "email": "hacker@test.com", "role": "ADMIN", "xp": 100, "currentLevel": 5, "completedLevels": [1,2,3,4]}`
- **Expected Outcome**: `PERMISSION_DENIED` (non-admin cannot set role="ADMIN").

### Payload 3: Direct Admin Document Insertion
- **Path**: `/admins/attacker_456`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"email": "attacker@evil.com", "role": "ADMIN"}`
- **Expected Outcome**: `PERMISSION_DENIED` (only existing admins can manage admins).

### Payload 4: Arbitrary PII Snooping
- **Path**: `/users/victim_user_123`
- **Auth**: `request.auth.uid = "curious_student_789"`
- **Operation**: `get`
- **Expected Outcome**: `PERMISSION_DENIED` (students cannot read other students' private user documents).

### Payload 5: Jumbo ID Poisoning (Denial of Wallet)
- **Path**: `/users/` + "a".repeat(2000)
- **Auth**: `request.auth.uid = "a".repeat(2000)`
- **Payload**: `{"id": "a".repeat(2000), "username": "dos", "email": "dos@test.com", "xp": 0, "currentLevel": 1, "completedLevels": []}`
- **Expected Outcome**: `PERMISSION_DENIED` (ID length exceeds 128 chars).

### Payload 6: Shadow Field Injection
- **Path**: `/users/attacker_456`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"id": "attacker_456", "username": "shadow", "email": "shadow@test.com", "xp": 0, "currentLevel": 1, "completedLevels": [], "isSuperUser": true, "__debugBypass": 1}`
- **Expected Outcome**: `PERMISSION_DENIED` (unrecognized fields not in schema).

### Payload 7: Public Profile Hijack
- **Path**: `/public_profiles/victim_user_123`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"userId": "victim_user_123", "username": "defaced", "batch": "2027", "level": 1, "xp": 0}`
- **Expected Outcome**: `PERMISSION_DENIED` (cannot write public profile for another user ID).

### Payload 8: Certificate Forgery (Falsified Recipient)
- **Path**: `/certificates/SG-FAKE-CERT-01`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"certificateId": "SG-FAKE-CERT-01", "userId": "victim_user_123", "studentName": "Faker", "completionDate": "2026-09-29", "status": "Valid"}`
- **Expected Outcome**: `PERMISSION_DENIED` (incoming().userId != request.auth.uid).

### Payload 9: Certificate Modification (Terminal State Tampering)
- **Path**: `/certificates/SG-CYBER-LEGIT-100`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Operation**: `update`
- **Payload**: `{"status": "Revoked", "finalScore": 0}`
- **Expected Outcome**: `PERMISSION_DENIED` (certificates are immutable once issued except by admin).

### Payload 10: Unauthenticated Global Query
- **Path**: `/users`
- **Auth**: `request.auth = null`
- **Operation**: `list`
- **Expected Outcome**: `PERMISSION_DENIED` (unauthenticated reads prohibited).

### Payload 11: Negative XP / Type Corruption Attack
- **Path**: `/users/attacker_456`
- **Auth**: `request.auth.uid = "attacker_456"`
- **Payload**: `{"id": "attacker_456", "username": "attacker", "email": "attacker@test.com", "xp": "TEN_THOUSAND", "currentLevel": -5, "completedLevels": "ALL"}`
- **Expected Outcome**: `PERMISSION_DENIED` (type checks fail on xp, level, and completedLevels).

### Payload 12: Public Profile Listing Without Auth Check
- **Path**: `/public_profiles`
- **Auth**: `request.auth = null`
- **Operation**: `list`
- **Expected Outcome**: `PERMISSION_DENIED` (must be signed in to view public leaderboard profiles).
