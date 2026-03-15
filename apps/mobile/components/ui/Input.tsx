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
        <Text className="text-sm font-semibold text-gray-700 mb-xs">
          {label}
        </Text>
      )}
      <TextInput
        className={[
          "h-14 rounded-xl px-md text-base text-gray-900",
          error ? "bg-red-50 border-2 border-error" : "bg-gray-100 border-0",
        ].join(" ")}
        placeholderTextColor={colors.gray[400]}
        autoCapitalize="none"
        style={style}
        {...props}
      />
      {error && <Text className="text-xs text-error mt-xs ml-xs">{error}</Text>}
    </View>
  );
}
