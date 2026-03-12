import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: Colors.light.text }]}>
            Home
          </Text>
          <Text
            style={[
              styles.welcomeText,
              { color: Colors.light.textSecondary },
            ]}
          >
            Welcome, {user?.email ?? "User"}
          </Text>
          <Text
            style={[
              styles.description,
              { color: Colors.light.textSecondary },
            ]}
          >
            You are authenticated. Start building your app from here.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button title="Sign Out" onPress={signOut} variant="outline" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: Layout.screenPadding,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: fontSize["4xl"],
    fontWeight: fontWeight.bold,
    marginBottom: Layout.spacing.sm,
  },
  welcomeText: {
    fontSize: fontSize.lg,
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontSize: fontSize.base,
    textAlign: "center",
  },
  footer: {
    paddingBottom: Layout.spacing.lg,
  },
});
