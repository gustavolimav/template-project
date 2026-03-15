import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";

const endpoints = [
  {
    method: "GET",
    path: "/api/health",
    auth: false,
    description: "Health check with database connectivity test",
  },
  {
    method: "GET",
    path: "/api/me",
    auth: true,
    description: "Returns the authenticated user's profile",
  },
  {
    method: "PATCH",
    path: "/api/me",
    auth: true,
    description: "Update display name and/or avatar URL",
  },
  {
    method: "DELETE",
    path: "/api/me",
    auth: true,
    description:
      "Full account erasure — auth user + profile (LGPD Art. 18, IV)",
  },
  {
    method: "GET",
    path: "/api/me/data-export",
    auth: true,
    description: "Export all user data as JSON (LGPD Art. 18, V)",
  },
  {
    method: "GET",
    path: "/api/auth/callback",
    auth: false,
    description: "OAuth2 redirect handler (code exchange)",
  },
  {
    method: "POST",
    path: "/api/auth/forgot-password",
    auth: false,
    description: "Sends a password reset email",
  },
  {
    method: "POST",
    path: "/api/auth/reset-password",
    auth: false,
    description: "Consumes reset token and sets new password",
  },
  {
    method: "GET",
    path: "/api/auth/verify-email",
    auth: false,
    description: "Email verification token handler",
  },
  {
    method: "GET",
    path: "/api/admin/migrations",
    auth: true,
    description: "List all migrations and their applied status",
  },
  {
    method: "POST",
    path: "/api/admin/migrations",
    auth: true,
    description: "Run all pending migrations (?dry_run=true to preview)",
  },
];

const methodColors: Record<
  string,
  "success" | "primary" | "warning" | "error" | "default"
> = {
  GET: "success",
  POST: "primary",
  PATCH: "warning",
  PUT: "warning",
  DELETE: "error",
};

export default function HomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700} color="white">
          app-template API
        </Typography>
        <Chip label="v1.1.0" size="small" variant="outlined" />
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Backend API for the app-template mobile app. Built with Next.js 15,
        Supabase Auth, and JWT verification.
      </Typography>

      {/* Endpoints */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          Endpoints
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 80 }}>Method</TableCell>
                <TableCell>Path</TableCell>
                <TableCell sx={{ width: 110 }}>Auth</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {endpoints.map((e, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Chip
                      label={e.method}
                      size="small"
                      color={methodColors[e.method] ?? "default"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography
                      component="code"
                      sx={{
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontSize: 12,
                        bgcolor: "action.hover",
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 1,
                      }}
                    >
                      {e.path}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={e.auth ? "Bearer JWT" : "Public"}
                      size="small"
                      variant="outlined"
                      color={e.auth ? "warning" : "success"}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {e.description}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Response format */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          Response format
        </Typography>
        <Paper
          variant="outlined"
          component="pre"
          sx={{
            p: 2.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13,
            color: "success.light",
            overflowX: "auto",
            m: 0,
          }}
        >{`// Success\n{ "data": <T>, "error": null }\n\n// Error\n{ "data": null, "error": { "code": "string", "message": "string" } }`}</Paper>
      </Box>

      {/* Authentication */}
      <Box sx={{ mb: 5 }}>
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ mb: 1.5, display: "block" }}
        >
          Authentication
        </Typography>
        <Paper
          variant="outlined"
          component="pre"
          sx={{
            p: 2.5,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: 13,
            color: "success.light",
            overflowX: "auto",
            m: 0,
            mb: 1.5,
          }}
        >{`Authorization: Bearer <supabase_access_token>`}</Paper>
        <Typography variant="body2" color="text.secondary">
          Obtain a token by signing in via the mobile app (Supabase Auth).
          Tokens expire after 1 hour and are refreshed automatically.
        </Typography>
      </Box>

      {/* Footer */}
      <Divider sx={{ mb: 3 }} />
      <Link href="/api/health" underline="hover" variant="body2">
        Health check →
      </Link>
    </Container>
  );
}
