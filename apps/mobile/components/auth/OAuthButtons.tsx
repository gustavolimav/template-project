import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Layout } from "@/constants/layout";
import { Colors } from "@/constants/colors";
import { fontSize } from "@app-template/ui";

export function OAuthButtons() {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = React.useState<"google" | "apple" | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading("google");
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(null);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setLoading("apple");
      setError(null);
      await signInWithApple();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Apple sign-in failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View
          style={[styles.line, { backgroundColor: Colors.light.border }]}
        />
        <Text style={[styles.dividerText, { color: Colors.light.textSecondary }]}>
          or continue with
        </Text>
        <View
          style={[styles.line, { backgroundColor: Colors.light.border }]}
        />
      </View>

      <Button
        title="Continue with Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        loading={loading === "google"}
        disabled={loading !== null}
      />

      {Platform.OS === "ios" && (
        <View style={styles.appleButton}>
          <Button
            title="Sign in with Apple"
            onPress={handleAppleSignIn}
            variant="secondary"
            loading={loading === "apple"}
            disabled={loading !== null}
          />
        </View>
      )}

      {error && (
        <Text style={[styles.error, { color: Colors.light.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.spacing.lg,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: Layout.spacing.md,
    fontSize: fontSize.sm,
  },
  appleButton: {
    marginTop: Layout.spacing.sm,
  },
  error: {
    fontSize: fontSize.xs,
    textAlign: "center",
    marginTop: Layout.spacing.sm,
  },
});
