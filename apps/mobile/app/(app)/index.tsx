import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import {
  useProfile,
  useDeleteAccount,
  useDataExport,
} from "@/hooks/useProfile";
import { colors } from "@app-template/ui";

function getInitials(email: string | undefined): string {
  if (!email) return "??";
  const [local] = email.split("@");
  const parts = (local ?? "").split(/[._-]/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (local ?? "").slice(0, 2).toUpperCase();
}

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function SettingsRow({
  label,
  sublabel,
  onPress,
  destructive = false,
  icon,
}: {
  label: string;
  sublabel?: string;
  onPress: () => void;
  destructive?: boolean;
  icon: IoniconName;
}) {
  const iconColor = destructive ? colors.error : colors.primary[600];
  const iconBg = destructive ? "#FEF2F2" : colors.primary[50];

  return (
    <TouchableOpacity
      className="flex-row items-center py-md px-lg min-h-[60px]"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mr-md shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text
          className={`text-base font-medium ${destructive ? "text-error" : "text-gray-900"}`}
        >
          {label}
        </Text>
        {sublabel && (
          <Text className="text-xs text-gray-400 mt-0.5 leading-4">
            {sublabel}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.gray[400]} />
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="text-xs font-bold text-gray-400 tracking-widest mb-sm mt-xl px-xs">
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

  const avatarUrl = profile?.avatarUrl;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View className="bg-white mx-md mt-md rounded-2xl overflow-hidden shadow-sm">
          {/* Colored header strip */}
          <View className="bg-primary-600 h-20" />
          {/* Avatar + info — overlapping the strip */}
          <View className="items-center -mt-10 pb-xl px-md">
            <View
              className="rounded-full border-4 border-white overflow-hidden"
              style={{
                width: 80,
                height: 80,
                backgroundColor: colors.primary[700],
              }}
            >
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={{ width: 80, height: 80 }}
                />
              ) : (
                <View className="flex-1 items-center justify-center">
                  <Text className="text-white text-2xl font-bold">
                    {getInitials(email)}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xl font-bold text-gray-900 mt-md">
              {displayName}
            </Text>
            <Text className="text-sm text-gray-500 mt-xs">{email}</Text>
            {memberSince && (
              <Text className="text-xs text-gray-400 mt-xs">
                Membro desde {memberSince}
              </Text>
            )}
          </View>
        </View>

        {/* Conta */}
        <View className="px-md">
          <SectionHeader title="CONTA" />
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <SettingsRow
              icon="person-outline"
              label="Editar Perfil"
              sublabel="Alterar nome e foto"
              onPress={() => router.push("/(app)/edit-profile" as Href)}
            />
            <View className="h-px bg-gray-100 ml-[72px]" />
            <SettingsRow
              icon="log-out-outline"
              label="Sair"
              sublabel="Encerrar a sessão atual"
              onPress={handleSignOut}
            />
          </View>

          {/* Privacidade e Dados — LGPD */}
          <SectionHeader title="PRIVACIDADE E DADOS" />
          <View className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <SettingsRow
              icon="cloud-download-outline"
              label="Exportar meus dados"
              sublabel="Baixar uma cópia (LGPD Art. 18, V)"
              onPress={handleExportData}
            />
            <View className="h-px bg-gray-100 ml-[72px]" />
            <SettingsRow
              icon="trash-outline"
              label="Excluir minha conta"
              sublabel="Apagar permanentemente (LGPD Art. 18, IV)"
              onPress={handleDeleteAccount}
              destructive
            />
          </View>

          {/* LGPD notice */}
          <Text className="text-xs text-gray-400 text-center mt-xl px-md leading-5">
            Seus dados são tratados conforme a LGPD (Lei 13.709/2018). Você tem
            o direito de acessar, corrigir, exportar ou excluir suas informações
            a qualquer momento.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
