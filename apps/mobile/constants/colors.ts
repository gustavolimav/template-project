import { colors } from "@app-template/ui";

export const Colors = {
  light: {
    text: colors.gray[900],
    textSecondary: colors.gray[500],
    background: colors.white,
    card: colors.gray[50],
    border: colors.gray[200],
    primary: colors.primary[600],
    primaryText: colors.white,
    error: colors.error,
    success: colors.success,
  },
  dark: {
    text: colors.gray[50],
    textSecondary: colors.gray[400],
    background: colors.gray[900],
    card: colors.gray[800],
    border: colors.gray[700],
    primary: colors.primary[500],
    primaryText: colors.white,
    error: colors.error,
    success: colors.success,
  },
} as const;
