import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
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
          {/* Brand mark */}
          <View className="items-center mb-2xl">
            <View className="w-16 h-16 bg-primary-100 rounded-2xl items-center justify-center mb-sm">
              <Ionicons name="mail-outline" size={30} color="#4F46E5" />
            </View>
          </View>

          <Text className="text-3xl font-bold text-gray-900 mb-xs">
            Redefinir senha
          </Text>
          <Text className="text-base text-gray-500 mb-2xl">
            Digite seu e-mail para receber um link de redefinição
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl px-md py-sm mb-md">
              <Text className="text-sm text-error text-center">{error}</Text>
            </View>
          )}

          <Input
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
          />

          <View className="mt-sm">
            <Button
              title="Enviar link de redefinição"
              onPress={handleReset}
              loading={loading}
            />
          </View>
          <View className="mt-sm">
            <Button
              title="Voltar para o login"
              onPress={() => router.back()}
              variant="outline"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
