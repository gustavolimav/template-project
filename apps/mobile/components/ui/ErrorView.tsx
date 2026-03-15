import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  return (
    <View className="flex-1 justify-center items-center p-lg">
      <Text className="text-base text-error text-center mb-md">{message}</Text>
      {onRetry && (
        <View className="min-w-[120px]">
          <Button title="Try Again" onPress={onRetry} variant="outline" />
        </View>
      )}
    </View>
  );
}
