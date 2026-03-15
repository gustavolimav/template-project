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
import { Ionicons } from "@expo/vector-icons";
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
            Criar Conta
          </Text>
          <Text className="text-base text-gray-500 mb-2xl">
            Cadastre-se para começar
          </Text>

          {error && (
            <View className="bg-red-50 border border-red-200 rounded-xl px-md py-sm mb-md">
              <Text className="text-sm text-error text-center">{error}</Text>
            </View>
          )}

          <AuthForm
            mode="register"
            onSubmit={handleRegister}
            loading={loading}
          />

          {/* LGPD consent — required before account creation (Art. 7, I) */}
          <TouchableOpacity
            className="flex-row items-start mt-md gap-sm bg-primary-50 rounded-xl p-md"
            onPress={() => setConsentGiven((v) => !v)}
            activeOpacity={0.75}
          >
            <View
              className="w-5 h-5 rounded-md justify-center items-center mt-0.5 shrink-0 border-2"
              style={{
                borderColor: consentGiven
                  ? colors.primary[600]
                  : colors.gray[300],
                backgroundColor: consentGiven
                  ? colors.primary[600]
                  : "transparent",
              }}
            >
              {consentGiven && (
                <Ionicons name="checkmark" size={12} color={colors.white} />
              )}
            </View>
            <Text className="flex-1 text-sm text-gray-600 leading-5">
              Li e concordo com a{" "}
              <Text className="text-primary-600 font-semibold">
                Política de Privacidade
              </Text>{" "}
              e autorizo o tratamento dos meus dados pessoais conforme a{" "}
              <Text className="text-primary-600 font-semibold">LGPD</Text>.
            </Text>
          </TouchableOpacity>

          <OAuthButtons />

          <View className="flex-row justify-center mt-2xl pb-lg">
            <Text className="text-sm text-gray-500">Já tem uma conta? </Text>
            <Link href="/(auth)/login">
              <Text className="text-sm font-semibold text-primary-600">
                Entrar
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
