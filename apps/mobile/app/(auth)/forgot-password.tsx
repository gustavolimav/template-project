import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { validateEmail } from "@app-template/utils";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.errors[0] ?? "Invalid email");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
      Alert.alert(
        "Email Sent",
        "If an account exists with this email, you will receive a password reset link.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset email",
      );
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
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.light.text }]}>
              Reset Password
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: Colors.light.textSecondary },
              ]}
            >
              Enter your email to receive a reset link
            </Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: Colors.light.error }]}>
              {error}
            </Text>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />

          <View style={styles.buttons}>
            <Button
              title="Send Reset Link"
              onPress={handleReset}
              loading={loading}
            />
            <View style={styles.backButton}>
              <Button
                title="Back to Sign In"
                onPress={() => router.back()}
                variant="outline"
              />
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
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
  buttons: {
    marginTop: Layout.spacing.sm,
  },
  backButton: {
    marginTop: Layout.spacing.sm,
  },
});
