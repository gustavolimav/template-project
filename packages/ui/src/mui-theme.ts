import { createTheme } from "@mui/material/styles";
import { colors, borderRadius, fontSize } from "./theme";

/**
 * MUI theme for apps/api web pages.
 * Extends the MUI default theme with the project's design tokens
 * from packages/ui/src/theme.ts so both web and mobile share the same palette.
 *
 * Usage:
 *   import { muiTheme } from "@app-template/ui";
 *   <ThemeProvider theme={muiTheme}>...</ThemeProvider>
 */
export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: colors.primary[400],
      main: colors.primary[500],
      dark: colors.primary[700],
      contrastText: colors.white,
    },
    error: {
      main: colors.error,
    },
    warning: {
      main: colors.warning,
    },
    success: {
      main: colors.success,
    },
    background: {
      default: "#0f0f0f",
      paper: "#1a1a1a",
    },
    text: {
      primary: "#e5e5e5",
      secondary: "#888888",
    },
    divider: "#222222",
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: fontSize.base,
    h1: { fontSize: fontSize["4xl"], fontWeight: 700 },
    h2: { fontSize: fontSize["3xl"], fontWeight: 700 },
    h3: { fontSize: fontSize["2xl"], fontWeight: 600 },
    h4: { fontSize: fontSize.xl, fontWeight: 600 },
    h5: { fontSize: fontSize.lg, fontWeight: 600 },
    h6: { fontSize: fontSize.base, fontWeight: 600 },
    body1: { fontSize: fontSize.base },
    body2: { fontSize: fontSize.sm },
    caption: { fontSize: fontSize.xs },
  },
  shape: {
    borderRadius: borderRadius.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0f0f0f",
          color: "#e5e5e5",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: fontSize.xs,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: "#222222",
          fontSize: fontSize.sm,
        },
        head: {
          backgroundColor: "#1a1a1a",
          color: "#888888",
          fontWeight: 500,
          fontSize: fontSize.xs,
          textTransform: "uppercase" as const,
          letterSpacing: "0.06em",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(even)": { backgroundColor: "#111111" },
          "&:nth-of-type(odd)": { backgroundColor: "#0d0d0d" },
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
  },
});
