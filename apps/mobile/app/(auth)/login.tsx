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
import { Ionicons } from "@expo/vector-icons";
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
          contentContainerClassName="flex-grow p-md pt-2xl"
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand mark */}
          <View className="items-center mb-2xl">
            <View className="w-16 h-16 bg-primary-600 rounded-2xl items-center justify-center mb-sm">
              <Ionicons name="layers-outline" size={30} color="white" />
            </View>
            <Text className="text-sm font-medium text-gray-400">
              app-template
            </Text>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 mb-xs">
            Bem-vindo de volta
          </Text>
          <Text className="text-base text-gray-500 mb-2xl">
            Entre na sua conta para continuar
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl px-md py-sm mb-md">
              <Text className="text-sm text-error text-center">{error}</Text>
            </View>
          )}

          <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />

          <TouchableOpacity className="items-end mt-xs mb-sm">
            <Link href="/(auth)/forgot-password">
              <Text className="text-sm font-semibold text-primary-600">
                Esqueceu a senha?
              </Text>
            </Link>
          </TouchableOpacity>

          <OAuthButtons />

          <View className="flex-row justify-center mt-2xl pb-lg">
            <Text className="text-sm text-gray-500">Não tem uma conta? </Text>
            <Link href="/(auth)/register">
              <Text className="text-sm font-semibold text-primary-600">
                Criar conta
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
