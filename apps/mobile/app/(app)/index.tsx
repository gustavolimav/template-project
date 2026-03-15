import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useDeleteAccount, useDataExport } from "@/hooks/useProfile";

function getInitials(email: string | undefined): string {
  if (!email) return "??";
  const [local] = email.split("@");
  const parts = (local ?? "").split(/[._-]/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (local ?? "").slice(0, 2).toUpperCase();
}

function SettingsRow({
  label,
  sublabel,
  onPress,
  destructive = false,
}: {
  label: string;
  sublabel?: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-md px-lg min-h-[56px]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-1">
        <Text
          className={`text-base ${destructive ? "text-error" : "text-gray-900"}`}
        >
          {label}
        </Text>
        {sublabel && (
          <Text className="text-xs text-gray-500 mt-0.5">{sublabel}</Text>
        )}
      </View>
      <Text className="text-xl text-gray-500 ml-sm">›</Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-semibold text-gray-500 tracking-wide mb-xs mt-md px-xs">
      {title}
    </Text>
  );
}

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const deleteAccount = useDeleteAccount();
  const dataExport = useDataExport();

  const displayName =
    profile?.displayName ?? user?.email?.split("@")[0] ?? "Usuário";
  const email = profile?.email ?? user?.email ?? "";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })
    : null;

  const handleSignOut = () => {
    Alert.alert("Sair", "Deseja realmente sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: signOut },
    ]);
  };

  const handleExportData = async () => {
    try {
      const data = await dataExport.mutateAsync();
      Alert.alert(
        "Dados exportados",
        "Seus dados foram coletados conforme a LGPD Art. 18, V.\n\n" +
          JSON.stringify(data, null, 2).slice(0, 500) +
          "\n...",
        [{ text: "OK" }],
      );
    } catch {
      Alert.alert("Erro", "Não foi possível exportar seus dados.");
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Esta ação é irreversível. Todos os seus dados serão permanentemente apagados conforme a LGPD Art. 18, IV.\n\nDeseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir permanentemente",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount.mutateAsync();
              await signOut();
            } catch {
              Alert.alert("Erro", "Não foi possível excluir a conta.");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerClassName="p-md pb-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View className="bg-gray-50 rounded-lg p-xl items-center mb-xl">
          <View className="w-[72px] h-[72px] rounded-full bg-primary-600 justify-center items-center mb-md">
            <Text className="text-white text-xl font-bold">
              {getInitials(email)}
            </Text>
          </View>
          <Text className="text-xl font-semibold text-gray-900 mb-xs">
            {displayName}
          </Text>
          <Text className="text-sm text-gray-500 mb-xs">{email}</Text>
          {memberSince && (
            <Text className="text-xs text-gray-500">
              Membro desde {memberSince}
            </Text>
          )}
        </View>

        {/* Conta */}
        <SectionHeader title="CONTA" />
        <View className="bg-gray-50 rounded-lg overflow-hidden">
          <SettingsRow
            label="Editar Perfil"
            sublabel="Alterar nome e foto"
            onPress={() => router.push("/(app)/edit-profile" as Href)}
          />
          <View className="h-px bg-gray-200 ml-lg" />
          <SettingsRow
            label="Sair"
            sublabel="Encerrar a sessão atual"
            onPress={handleSignOut}
          />
        </View>

        {/* Privacidade e Dados — LGPD */}
        <SectionHeader title="PRIVACIDADE E DADOS" />
        <View className="bg-gray-50 rounded-lg overflow-hidden">
          <SettingsRow
            label="Exportar meus dados"
            sublabel="Baixar uma cópia das suas informações (LGPD Art. 18, V)"
            onPress={handleExportData}
          />
          <View className="h-px bg-gray-200 ml-lg" />
          <SettingsRow
            label="Excluir minha conta"
            sublabel="Apagar permanentemente sua conta e dados (LGPD Art. 18, IV)"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* LGPD notice */}
        <Text className="text-xs text-gray-500 text-center mt-xl px-md leading-5">
          Seus dados são tratados conforme a Lei Geral de Proteção de Dados
          (LGPD — Lei 13.709/2018). Você tem o direito de acessar, corrigir,
          exportar ou excluir suas informações pessoais a qualquer momento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
