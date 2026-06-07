# Firebase Firestore Security Specification

This specification documents the validation invariants, risk scenarios, and access policies for the application's Firestore database.

## 1. Data Invariants
- `v2ray_configs`: Only admins can create, update, or delete. Non-admins cannot read or write, while the frontend fetches active configs via the admin portal or server-side endpoints.
- `wg_configs`: Only admins can create, update, or delete. Non-admins cannot read or write.
- `admins`: Authorized admins. Document ID matches the user's Auth UID. Can only be checked or populated by existing admins or system.

## 2. The Dirty Dozen Payloads (Risk Scenarios)
1. Write config without being authenticated -> Rejected.
2. Edit config as authenticated non-admin user -> Rejected.
3. Access config configurations as unauthenticated user -> Rejected.
4. Admin email spoofing with `email_verified` as false -> Rejected.
5. Setting self-role in user metadata -> Rejected.
6. Massive ID payload in subscription configurations -> Rejected (length restricted).
7. Null/undefined fields on mandatory properties like `name` or `isActive` -> Rejected.
8. Modifying immortal field `createdAt` post-creation -> Rejected.
9. Injecting extra fields (ghost keys) in v2ray_configs -> Rejected.
10. Attempting list queries without specific restrictions -> Rejected.
11. Bypassing size boundaries on notes or name parameters -> Rejected.
12. Creating subscription with invalid system timestamp -> Rejected.

## 3. Test Runner Definition
The following outlines the validation structure and rules logic that protects these. We will deploy secure `firestore.rules` next.
