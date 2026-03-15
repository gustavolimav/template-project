import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { colors } from "@app-template/ui";

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

  const buttonClass = [
    "h-12 rounded-md justify-center items-center px-lg",
    variant === "primary" && "bg-primary-600",
    variant === "secondary" && "bg-gray-50",
    variant === "outline" && "bg-transparent border border-gray-200",
    isDisabled && "opacity-50",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <TouchableOpacity
      className={buttonClass}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? colors.white : colors.primary[600]}
        />
      ) : (
        <Text
          className={[
            "text-base font-semibold",
            variant === "primary" ? "text-white" : "text-primary-600",
          ].join(" ")}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
