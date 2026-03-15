import React from "react";
import { View, ActivityIndicator } from "react-native";
import { colors } from "@app-template/ui";

export function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color={colors.primary[600]} />
    </View>
  );
}
