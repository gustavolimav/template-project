import React, { useState } from "react";
import {
  View,
  Text,
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
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center p-md">
          <View className="mb-2xl">
            <Text className="text-3xl font-bold text-gray-900 mb-xs">
              Reset Password
            </Text>
            <Text className="text-base text-gray-500">
              Enter your email to receive a reset link
            </Text>
          </View>

          {error && (
            <Text className="text-sm text-error text-center mb-md">
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

          <View className="mt-sm">
            <Button
              title="Send Reset Link"
              onPress={handleReset}
              loading={loading}
            />
          </View>
          <View className="mt-sm">
            <Button
              title="Back to Sign In"
              onPress={() => router.back()}
              variant="outline"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
