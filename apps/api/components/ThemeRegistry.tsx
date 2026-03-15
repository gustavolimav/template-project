"use client";

/**
 * MUI SSR adapter for Next.js App Router.
 *
 * @mui/material-nextjs provides AppRouterCacheProvider which injects Emotion
 * styles into the <head> on the server, preventing the flash of unstyled content
 * (FOUC) that would otherwise occur before client-side hydration.
 *
 * This must be a Client Component because MUI's ThemeProvider uses React context.
 */
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { muiTheme } from "@app-template/ui/mui-theme";

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
