import React, { useState } from "react";
import {
  View,
  Text,
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center p-md"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mb-2xl">
            <Text className="text-3xl font-bold text-gray-900 mb-xs">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500">
              Sign in to your account
            </Text>
          </View>

          {error && (
            <Text className="text-sm text-error text-center mb-md">
              {error}
            </Text>
          )}

          <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />

          <TouchableOpacity className="items-end mt-sm">
            <Link href="/(auth)/forgot-password">
              <Text className="text-sm font-medium text-primary-600">
                Forgot password?
              </Text>
            </Link>
          </TouchableOpacity>

          <OAuthButtons />

          <View className="flex-row justify-center mt-2xl">
            <Text className="text-sm text-gray-500">
              Don't have an account?{" "}
            </Text>
            <Link href="/(auth)/register">
              <Text className="text-sm font-medium text-primary-600">
                Sign Up
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
