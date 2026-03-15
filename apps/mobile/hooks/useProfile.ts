import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as FileSystem from "expo-file-system/legacy";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { ApiResponse, AuthUser } from "@app-template/types";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<AuthUser>>("/api/me");
      return data.data;
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { displayName?: string; avatarUrl?: string }) => {
      const { data } = await api.patch<ApiResponse<AuthUser>>("/api/me", updates);
      return data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
    },
  });
}

export function useUploadAvatar() {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();

  return useMutation({
    mutationFn: async (localUri: string) => {
      if (!profile?.id) throw new Error("Profile not loaded");

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) throw new Error("File not found");

      const ext = localUri.split(".").pop()?.toLowerCase() ?? "jpg";
      const contentType = ext === "png" ? "image/png" : "image/jpeg";
      const path = `${profile.id}/avatar.${ext}`;

      // Read file as base64 and convert to ArrayBuffer
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, bytes.buffer, { contentType, upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      // Append cache-buster so the UI refreshes immediately
      const avatarUrl = `${publicUrl}?v=${Date.now()}`;
      return updateProfile.mutateAsync({ avatarUrl });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete("/api/me");
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

export function useDataExport() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<ApiResponse<Record<string, unknown>>>(
        "/api/me/data-export",
      );
      return data.data;
    },
  });
}
