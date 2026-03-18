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
    "**/*.{ts,tsx}",
    "!**/__tests__/**",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!app/_layout.tsx",
    "!app/(auth)/_layout.tsx",
    "!app/(app)/_layout.tsx",
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
