# ADR-005: MMKV for Token Storage

## Status
Accepted

## Context
Need to store auth tokens on the mobile device. Tokens must be accessible synchronously for Axios interceptors.

## Decision
Use `react-native-mmkv` with a custom Supabase storage adapter.

## Rationale
- 10x faster than AsyncStorage (synchronous reads)
- Supabase SDK accepts custom storage adapters
- Encryption at rest built into MMKV
- Simple API: `getString()`, `set()`, `delete()`
- In-memory fallback in Jest mock for testing

## Trade-offs
- Native module — cannot use Expo Go (requires dev client via EAS Build)
- Less secure than iOS Keychain (`expo-secure-store`)
  - Mitigated by MMKV's built-in encryption
  - Keychain has 2048-byte value limit (too small for some tokens)
- Adds native dependency to the project
