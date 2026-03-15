import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
    mutationFn: async (updates: { displayName?: string }) => {
      const { data } = await api.patch<ApiResponse<AuthUser>>(
        "/api/me",
        updates,
      );
      return data.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["profile"], updated);
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
      const { data } =
        await api.get<ApiResponse<Record<string, unknown>>>(
          "/api/me/data-export",
        );
      return data.data;
    },
  });
}
