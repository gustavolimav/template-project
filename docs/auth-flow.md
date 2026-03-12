# Authentication Flow

## Email/Password Sign Up

```
Mobile App                    Supabase Auth                  API (Next.js)
    │                              │                              │
    │── signUp(email, pass) ──────→│                              │
    │                              │── Create user in auth.users  │
    │                              │── Trigger → create profile   │
    │                              │── Send verification email    │
    │←── Session (access+refresh) ─│                              │
    │                              │                              │
    │  (user clicks email link)    │                              │
    │                              │── Mark email_confirmed_at    │
    │                              │                              │
    │── GET /api/me ──────────────────────────────────────────────→│
    │   Authorization: Bearer <token>                             │
    │                              │   middleware: check header   │
    │                              │   auth.ts: verify JWT (JWKS) │
    │                              │   route: query profiles      │
    │←── { data: user, error: null } ─────────────────────────────│
```

## OAuth Flow (Google / Apple)

```
Mobile App              System Browser / Apple Auth     Supabase Auth
    │                          │                            │
    │── signInWithOAuth ──────→│                            │
    │   or signInWithApple     │                            │
    │                          │── Redirect to provider ──→│
    │                          │←── Provider callback ─────│
    │                          │                            │
    │                          │   Create/link user         │
    │←── Deep link back ───────│                            │
    │                          │                            │
    │── Exchange code for session ─────────────────────────→│
    │←── Session ──────────────────────────────────────────│
    │                          │                            │
    │   Store tokens in MMKV   │                            │
```

## Token Refresh

```
Mobile App                    Supabase Auth
    │                              │
    │  (access token expires)      │
    │  Supabase SDK auto-detects   │
    │── refreshSession() ────────→│
    │                              │── Validate refresh token
    │                              │── Issue new access + refresh
    │←── New session ─────────────│
    │                              │
    │  New tokens stored in MMKV   │
```

## 401 Retry (Axios Interceptor)

```
Mobile App              API              Supabase Auth
    │                    │                    │
    │── Request ────────→│                    │
    │←── 401 ───────────│                    │
    │                    │                    │
    │── refreshSession() ───────────────────→│
    │←── New session ───────────────────────│
    │                    │                    │
    │── Retry request ──→│                    │
    │←── 200 ───────────│                    │
```
