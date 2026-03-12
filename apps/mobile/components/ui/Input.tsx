import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import type { TextInputProps } from "react-native";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize } from "@app-template/ui";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const colors = Colors.light;

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            backgroundColor: colors.background,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        {...props}
      />
      {error && (
        <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Layout.spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    marginBottom: Layout.spacing.xs,
    fontWeight: "500",
  },
  input: {
    height: Layout.inputHeight,
    borderWidth: 1,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    fontSize: fontSize.base,
  },
  error: {
    fontSize: fontSize.xs,
    marginTop: Layout.spacing.xs,
  },
});
