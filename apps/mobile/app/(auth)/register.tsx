import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthForm } from "@/components/auth/AuthForm";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@app-template/ui";

export default function RegisterScreen() {
  const { signUpWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleRegister = async (email: string, password: string) => {
    if (!consentGiven) {
      setError(
        "Você precisa aceitar a Política de Privacidade para continuar.",
      );
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await signUpWithEmail(email, password);
      Alert.alert(
        "Verifique seu e-mail",
        "Enviamos um link de verificação. Por favor, verifique seu e-mail para continuar.",
        [{ text: "OK", onPress: () => router.replace("/(auth)/login") }],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha no cadastro");
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
              Criar Conta
            </Text>
            <Text className="text-base text-gray-500">
              Cadastre-se para começar
            </Text>
          </View>

          {error && (
            <Text className="text-sm text-error text-center mb-md">
              {error}
            </Text>
          )}

          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            loading={loading}
          />

          {/* LGPD consent — required before account creation (Art. 7, I) */}
          <TouchableOpacity
            className="flex-row items-start mt-md gap-sm"
            onPress={() => setConsentGiven((v) => !v)}
            activeOpacity={0.7}
          >
            <View
              className="w-5 h-5 border-2 rounded justify-center items-center mt-0.5 shrink-0"
              style={{
                borderColor: consentGiven
                  ? colors.primary[600]
                  : colors.gray[200],
                backgroundColor: consentGiven
                  ? colors.primary[600]
                  : "transparent",
              }}
            >
              {consentGiven && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text className="flex-1 text-sm text-gray-500 leading-5">
              Li e concordo com a{" "}
              <Text className="text-primary-600">Política de Privacidade</Text>{" "}
              e autorizo o tratamento dos meus dados pessoais conforme a{" "}
              <Text className="text-primary-600">LGPD</Text>.
            </Text>
          </TouchableOpacity>

          <OAuthButtons />

          <View className="flex-row justify-center mt-2xl">
            <Text className="text-sm text-gray-500">Já tem uma conta? </Text>
            <Link href="/(auth)/login">
              <Text className="text-sm font-medium text-primary-600">
                Entrar
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
