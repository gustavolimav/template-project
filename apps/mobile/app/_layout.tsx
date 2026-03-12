import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Sentry from "@sentry/react-native";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { initSentry } from "@/lib/sentry";

initSentry();

/**
 * Root layout: wraps the entire app with providers.
 * Auth state determines which route group is shown:
 * - (auth)/ screens if not authenticated
 * - (app)/ screens if authenticated
 *
 * Sentry.wrap() adds the crash boundary and automatic session tracking.
 */
function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <QueryProvider>
          <StatusBar style="auto" />
          <Slot />
        </QueryProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default Sentry.wrap(RootLayout);
