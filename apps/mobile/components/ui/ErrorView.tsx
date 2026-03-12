import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize } from "@app-template/ui";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.message, { color: Colors.light.error }]}>
        {message}
      </Text>
      {onRetry && (
        <View style={styles.button}>
          <Button title="Try Again" onPress={onRetry} variant="outline" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Layout.spacing.lg,
  },
  message: {
    fontSize: fontSize.base,
    textAlign: "center",
    marginBottom: Layout.spacing.md,
  },
  button: {
    minWidth: 120,
  },
});
