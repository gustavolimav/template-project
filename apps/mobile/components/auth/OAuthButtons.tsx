import React from "react";
import { View, Text, Platform } from "react-native";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export function OAuthButtons() {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [loading, setLoading] = React.useState<"google" | "apple" | null>(null);
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
    <View className="mt-lg">
      {/* Divider */}
      <View className="flex-row items-center mb-lg">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="text-sm text-gray-500 px-md">or continue with</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      <Button
        title="Continue with Google"
        onPress={handleGoogleSignIn}
        variant="outline"
        loading={loading === "google"}
        disabled={loading !== null}
      />

      {Platform.OS === "ios" && (
        <View className="mt-sm">
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
        <Text className="text-xs text-error text-center mt-sm">{error}</Text>
      )}
    </View>
  );
}
