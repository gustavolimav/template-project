module.exports = {
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!(.pnpm|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|react-native-mmkv|@supabase/.*|@tanstack/.*|nativewind|tailwindcss|@app-template/.*))",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFiles: ["./__mocks__/react-native-mmkv.ts"],
  collectCoverageFrom: [
    // Only measure coverage on testable units (components, hooks, lib)
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "!**/__tests__/**",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    // Sentry init — side-effect only file, not unit-testable
    "!lib/sentry.ts",
    // Axios instance — integration-tested, not unit-testable
    "!lib/api.ts",
    // Device-only hooks — require real device/permissions, not unit-testable
    "!hooks/usePushNotifications.ts",
    "!hooks/useProfile.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 40,
      functions: 40,
      branches: 30,
      statements: 40,
    },
  },
};
