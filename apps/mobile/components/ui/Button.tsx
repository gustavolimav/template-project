import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { colors } from "@app-template/ui";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger";
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
    "h-14 rounded-xl justify-center items-center px-lg",
    variant === "primary" && "bg-primary-600",
    variant === "secondary" && "bg-gray-100",
    variant === "outline" && "bg-transparent border-2 border-gray-200",
    variant === "danger" && "bg-error",
    isDisabled && "opacity-50",
  ]
    .filter(Boolean)
    .join(" ");

  const textColor =
    variant === "primary" || variant === "danger"
      ? colors.white
      : colors.primary[600];

  return (
    <TouchableOpacity
      className={buttonClass}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text className="text-base font-semibold" style={{ color: textColor }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
