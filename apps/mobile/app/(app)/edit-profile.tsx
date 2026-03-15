import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
} from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { colors } from "@app-template/ui";

function getInitials(email: string | undefined): string {
  if (!email) return "??";
  const [local] = email.split("@");
  const parts = (local ?? "").split(/[._-]/);
  if (parts.length >= 2) {
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  }
  return (local ?? "").slice(0, 2).toUpperCase();
}

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (profile?.displayName) {
      setDisplayName(profile.displayName);
    }
  }, [profile?.displayName]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "Precisamos de acesso às suas fotos para definir a imagem de perfil.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        await uploadAvatar.mutateAsync(result.assets[0].uri);
      } catch {
        Alert.alert("Erro", "Não foi possível atualizar a foto de perfil.");
      }
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        displayName: displayName.trim() || undefined,
      });
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  const email = profile?.email ?? user?.email ?? "";
  const avatarUrl = profile?.avatarUrl;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView
        contentContainerClassName="p-md pb-16"
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View className="items-center mb-2xl mt-xl">
          <TouchableOpacity onPress={handlePickImage} activeOpacity={0.8}>
            <View>
              <View
                className="rounded-full border-4 border-white overflow-hidden"
                style={{
                  width: 108,
                  height: 108,
                  backgroundColor: colors.primary[600],
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.12,
                  shadowRadius: 8,
                }}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={{ width: 108, height: 108 }}
                  />
                ) : (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-3xl font-bold">
                      {getInitials(email)}
                    </Text>
                  </View>
                )}
              </View>
              {/* Camera badge */}
              <View
                className="absolute bottom-0 right-0 w-9 h-9 rounded-full items-center justify-center border-2 border-white"
                style={{ backgroundColor: colors.primary[600] }}
              >
                {uploadAvatar.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={16} color="#fff" />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-sm text-gray-400 mt-md">
            Toque para alterar a foto
          </Text>
        </View>

        {/* Form card */}
        <View className="bg-white rounded-2xl p-md shadow-sm mb-md">
          <Input
            label="Nome de exibição"
            placeholder="Seu nome"
            value={displayName}
            onChangeText={setDisplayName}
            autoComplete="name"
            returnKeyType="done"
          />

          <Input
            label="E-mail"
            value={email}
            editable={false}
            style={{ opacity: 0.5 }}
          />
          <Text className="text-xs text-gray-400 -mt-sm mb-xs ml-xs">
            O e-mail não pode ser alterado aqui.
          </Text>
        </View>

        <Button
          title="Salvar alterações"
          onPress={handleSave}
          loading={updateProfile.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
