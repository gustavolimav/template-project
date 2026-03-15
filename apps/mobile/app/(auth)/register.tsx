import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors.light.text }]}>
              Criar Conta
            </Text>
            <Text
              style={[styles.subtitle, { color: Colors.light.textSecondary }]}
            >
              Cadastre-se para começar
            </Text>
          </View>

          {error && (
            <Text style={[styles.errorText, { color: Colors.light.error }]}>
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
            style={styles.consentRow}
            onPress={() => setConsentGiven((v) => !v)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: consentGiven
                    ? Colors.light.primary
                    : Colors.light.border,
                  backgroundColor: consentGiven
                    ? Colors.light.primary
                    : "transparent",
                },
              ]}
            >
              {consentGiven && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text
              style={[styles.consentText, { color: Colors.light.textSecondary }]}
            >
              Li e concordo com a{" "}
              <Text style={{ color: Colors.light.primary }}>
                Política de Privacidade
              </Text>{" "}
              e autorizo o tratamento dos meus dados pessoais conforme a{" "}
              <Text style={{ color: Colors.light.primary }}>LGPD</Text>.
            </Text>
          </TouchableOpacity>

          <OAuthButtons />

          <View style={styles.footer}>
            <Text
              style={[styles.footerText, { color: Colors.light.textSecondary }]}
            >
              Já tem uma conta?{" "}
            </Text>
            <Link href="/(auth)/login">
              <Text style={[styles.linkText, { color: Colors.light.primary }]}>
                Entrar
              </Text>
            </Link>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
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
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  consentText: {
    flex: 1,
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
  linkText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Layout.spacing["2xl"],
  },
  footerText: {
    fontSize: fontSize.sm,
  },
});
