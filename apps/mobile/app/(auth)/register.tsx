import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "@/components/auth/AuthForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

export default function RegisterScreen() {
  const { signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signUpWithEmail(email, password);
      Alert.alert(
        "Check your email",
        "We've sent you a verification link. Please verify your email to continue.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
              Create Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: Colors.light.textSecondary },
              ]}
            >
              Sign up to get started
            </Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: Colors.light.error }]}>
              {error}
            </Text>
          )}

          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            loading={loading}
          />

          <OAuthButtons />

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: Colors.light.textSecondary },
              ]}
            >
              Already have an account?{" "}
            </Text>
            <Link href="/(auth)/login">
              <Text
                style={[styles.linkText, { color: Colors.light.primary }]}
              >
                Sign In
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
