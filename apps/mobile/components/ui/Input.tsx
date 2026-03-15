import React from "react";
import { View, TextInput, Text } from "react-native";
import type { TextInputProps } from "react-native";
import { colors } from "@app-template/ui";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View className="mb-md">
      {label && (
        <Text className="text-sm font-medium text-gray-900 mb-xs">{label}</Text>
      )}
      <TextInput
        className={[
          "h-12 border rounded-md px-md text-base bg-white text-gray-900",
          error ? "border-error" : "border-gray-200",
        ].join(" ")}
        placeholderTextColor={colors.gray[500]}
        autoCapitalize="none"
        style={style}
        {...props}
      />
      {error && <Text className="text-xs text-error mt-xs">{error}</Text>}
    </View>
  );
}
