import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useProfile, useDeleteAccount, useDataExport } from "@/hooks/useProfile";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

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
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.rowText}>
        <Text
          style={[
            styles.rowLabel,
            { color: destructive ? Colors.light.error : Colors.light.text },
          ]}
        >
          {label}
        </Text>
        {sublabel && (
          <Text
            style={[styles.rowSublabel, { color: Colors.light.textSecondary }]}
          >
            {sublabel}
          </Text>
        )}
      </View>
      <Text style={[styles.chevron, { color: Colors.light.textSecondary }]}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text style={[styles.sectionHeader, { color: Colors.light.textSecondary }]}>
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: Colors.light.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View
          style={[styles.profileCard, { backgroundColor: Colors.light.card }]}
        >
          <View
            style={[styles.avatar, { backgroundColor: Colors.light.primary }]}
          >
            <Text style={styles.avatarText}>{getInitials(email)}</Text>
          </View>
          <Text style={[styles.displayName, { color: Colors.light.text }]}>
            {displayName}
          </Text>
          <Text style={[styles.email, { color: Colors.light.textSecondary }]}>
            {email}
          </Text>
          {memberSince && (
            <Text
              style={[
                styles.memberSince,
                { color: Colors.light.textSecondary },
              ]}
            >
              Membro desde {memberSince}
            </Text>
          )}
        </View>

        {/* Conta */}
        <SectionHeader title="CONTA" />
        <View style={[styles.card, { backgroundColor: Colors.light.card }]}>
          <SettingsRow
            label="Sair"
            sublabel="Encerrar a sessão atual"
            onPress={handleSignOut}
          />
        </View>

        {/* Privacidade e Dados — LGPD */}
        <SectionHeader title="PRIVACIDADE E DADOS" />
        <View style={[styles.card, { backgroundColor: Colors.light.card }]}>
          <SettingsRow
            label="Exportar meus dados"
            sublabel="Baixar uma cópia das suas informações (LGPD Art. 18, V)"
            onPress={handleExportData}
          />
          <View
            style={[
              styles.separator,
              { backgroundColor: Colors.light.border },
            ]}
          />
          <SettingsRow
            label="Excluir minha conta"
            sublabel="Apagar permanentemente sua conta e dados (LGPD Art. 18, IV)"
            onPress={handleDeleteAccount}
            destructive
          />
        </View>

        {/* LGPD notice */}
        <Text
          style={[styles.lgpdNotice, { color: Colors.light.textSecondary }]}
        >
          Seus dados são tratados conforme a Lei Geral de Proteção de Dados
          (LGPD — Lei 13.709/2018). Você tem o direito de acessar, corrigir,
          exportar ou excluir suas informações pessoais a qualquer momento.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: Layout.screenPadding,
    paddingBottom: Layout.spacing["3xl"],
  },
  profileCard: {
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.xl,
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Layout.spacing.md,
  },
  avatarText: {
    color: "#fff",
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  displayName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    marginBottom: Layout.spacing.xs,
  },
  email: {
    fontSize: fontSize.sm,
    marginBottom: Layout.spacing.xs,
  },
  memberSince: {
    fontSize: fontSize.xs,
  },
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    letterSpacing: 0.8,
    marginBottom: Layout.spacing.xs,
    marginTop: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.xs,
  },
  card: {
    borderRadius: Layout.borderRadius.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    minHeight: 56,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: fontSize.base,
  },
  rowSublabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  chevron: {
    fontSize: 20,
    marginLeft: Layout.spacing.sm,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Layout.spacing.lg,
  },
  lgpdNotice: {
    fontSize: fontSize.xs,
    lineHeight: 18,
    textAlign: "center",
    marginTop: Layout.spacing.xl,
    paddingHorizontal: Layout.spacing.md,
  },
});
