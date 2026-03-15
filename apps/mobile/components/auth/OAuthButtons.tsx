import React from "react";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@app-template/ui";

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

  const isDisabled = loading !== null;

  return (
    <View className="mt-lg">
      {/* Divider */}
      <View className="flex-row items-center mb-lg">
        <View className="flex-1 h-px bg-gray-200" />
        <Text className="text-sm text-gray-400 px-md">ou continue com</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>

      {/* Google */}
      <TouchableOpacity
        className="h-14 rounded-xl flex-row items-center justify-center border-2 border-gray-200 bg-white gap-sm"
        onPress={handleGoogleSignIn}
        disabled={isDisabled}
        activeOpacity={0.75}
        style={{ opacity: isDisabled ? 0.5 : 1 }}
      >
        {loading === "google" ? (
          <ActivityIndicator color={colors.gray[500]} />
        ) : (
          <>
            <Ionicons name="logo-google" size={20} color="#4285F4" />
            <Text className="text-base font-semibold text-gray-800">
              Continuar com Google
            </Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple (iOS only) */}
      {Platform.OS === "ios" && (
        <TouchableOpacity
          className="h-14 rounded-xl flex-row items-center justify-center bg-gray-900 gap-sm mt-sm"
          onPress={handleAppleSignIn}
          disabled={isDisabled}
          activeOpacity={0.75}
          style={{ opacity: isDisabled ? 0.5 : 1 }}
        >
          {loading === "apple" ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="logo-apple" size={20} color={colors.white} />
              <Text className="text-base font-semibold text-white">
                Continuar com Apple
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {error && (
        <Text className="text-xs text-error text-center mt-sm">{error}</Text>
      )}
    </View>
  );
}
