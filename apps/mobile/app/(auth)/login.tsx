import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "@/components/auth/AuthForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

export default function LoginScreen() {
  const { signInWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.light.text }]}>
              Welcome Back
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: Colors.light.textSecondary },
              ]}
            >
              Sign in to your account
            </Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: Colors.light.error }]}>
              {error}
            </Text>
          )}

          <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />

          <TouchableOpacity style={styles.forgotPassword}>
            <Link href="/(auth)/forgot-password">
              <Text
                style={[
                  styles.linkText,
                  { color: Colors.light.primary },
                ]}
              >
                Forgot password?
              </Text>
            </Link>
          </TouchableOpacity>

          <OAuthButtons />

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: Colors.light.textSecondary },
              ]}
            >
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register">
              <Text
                style={[styles.linkText, { color: Colors.light.primary }]}
              >
                Sign Up
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Layout.screenPadding,
  },
  header: {
    marginBottom: Layout.spacing["2xl"],
  },
  title: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.base,
  },
  errorText: {
    fontSize: fontSize.sm,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  forgotPassword: {
    alignItems: "flex-end",
    marginTop: Layout.spacing.sm,
  },
  linkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Layout.spacing["2xl"],
  },
  footerText: {
    fontSize: fontSize.sm,
  },
});
