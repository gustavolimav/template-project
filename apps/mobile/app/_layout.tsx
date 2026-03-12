import React from "react";
import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

/**
 * Root layout: wraps the entire app with providers.
 * Auth state determines which route group is shown:
 * - (auth)/ screens if not authenticated
 * - (app)/ screens if authenticated
 */
export default function RootLayout() {
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
