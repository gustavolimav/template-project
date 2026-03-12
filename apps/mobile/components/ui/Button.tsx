import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/colors";
import { Layout } from "@/constants/layout";
import { fontSize, fontWeight } from "@app-template/ui";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const colors = Colors.light;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" && {
          backgroundColor: colors.primary,
        },
        variant === "secondary" && {
          backgroundColor: colors.card,
        },
        variant === "outline" && {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.border,
        },
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.primaryText : colors.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "primary" && { color: colors.primaryText },
            variant !== "primary" && { color: colors.primary },
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: Layout.buttonHeight,
    borderRadius: Layout.borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
  },
  text: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
  },
});
