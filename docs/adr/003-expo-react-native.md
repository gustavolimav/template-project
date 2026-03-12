# ADR-003: Expo + React Native for iOS

## Status
Accepted

## Context
Need to build an iOS app for the Apple App Store.

## Decision
Use Expo SDK with React Native. Build with EAS Build, submit with EAS Submit.

## Rationale
- No native code compilation during development
- Cloud builds via EAS (no Xcode dependency for builds)
- File-based routing with expo-router (same mental model as Next.js)
- Rich plugin ecosystem (apple-authentication, auth-session, etc.)
- Over-the-air updates possible with EAS Update
- TypeScript support out of the box

## Trade-offs
- Cannot use Expo Go with native modules (MMKV, Apple Auth) — must use dev client
- Larger app binary than bare React Native
- Some native APIs require custom plugins
