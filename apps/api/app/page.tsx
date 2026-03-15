import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

// ─── Data ──────────────────────────────────────────────────────────────────

type Endpoint = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  auth: boolean;
  description: string;
};

type EndpointGroup = {
  label: string;
  endpoints: Endpoint[];
};

const groups: EndpointGroup[] = [
  {
    label: "Health",
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        auth: false,
        description: "Health check with database connectivity test",
      },
    ],
  },
  {
    label: "User",
    endpoints: [
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
    ],
  },
  {
    label: "Auth",
    endpoints: [
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
    ],
  },
  {
    label: "Admin",
    endpoints: [
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
    ],
  },
];

const methodChipColor: Record<
  string,
  "success" | "primary" | "warning" | "error" | "default"
> = {
  GET: "success",
  POST: "primary",
  PATCH: "warning",
  PUT: "warning",
  DELETE: "error",
};

// ─── Sub-components ────────────────────────────────────────────────────────

function MethodChip({ method }: { method: string }) {
  return (
    <Chip
      label={method}
      size="small"
      color={methodChipColor[method] ?? "default"}
      sx={{ fontFamily: "monospace", fontWeight: 700, minWidth: 64 }}
    />
  );
}

function CodeSpan({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      component="code"
      sx={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 12,
        bgcolor: "action.selected",
        px: 0.75,
        py: 0.25,
        borderRadius: 0.75,
        letterSpacing: 0,
      }}
    >
      {children}
    </Typography>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 2,
        bgcolor: "#0d0d0d",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 12.5,
        color: "success.light",
        overflowX: "auto",
        lineHeight: 1.7,
      }}
    >
      {children}
    </Box>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  const totalEndpoints = groups.reduce((n, g) => n + g.endpoints.length, 0);

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* ── Hero ── */}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 5,
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.06) 50%, transparent 100%)",
          borderColor: "rgba(99,102,241,0.25)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={1.5}
          flexWrap="wrap"
          mb={1.5}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            color="white"
          >
            app-template API
          </Typography>
          <Chip label="v1.1.0" size="small" variant="outlined" />
          <Chip
            icon={
              <FiberManualRecordIcon
                sx={{ fontSize: "10px !important", color: "success.main" }}
              />
            }
            label="Online"
            size="small"
            variant="outlined"
            color="success"
            sx={{ borderRadius: 2 }}
          />
        </Stack>

        <Typography variant="body1" color="text.secondary" mb={2.5}>
          Backend API for the app-template mobile app. Built with Next.js 15,
          Supabase Auth, and JWT verification.
        </Typography>

        <Stack direction="row" gap={1} flexWrap="wrap">
          {["Next.js 15", "Supabase Auth", "TypeScript", "Vercel"].map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{ bgcolor: "action.selected" }}
            />
          ))}
        </Stack>
      </Paper>

      {/* ── Stats row ── */}
      <Grid container spacing={2} mb={5}>
        {[
          { value: totalEndpoints, label: "Endpoints" },
          { value: "JWT", label: "Auth method" },
          { value: "REST", label: "API style" },
        ].map(({ value, label }) => (
          <Grid size={{ xs: 4 }} key={label}>
            <Paper
              variant="outlined"
              sx={{ p: 2, textAlign: "center", bgcolor: "background.paper" }}
            >
              <Typography variant="h5" fontWeight={700} color="white">
                {value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Endpoint groups ── */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1.5, display: "block" }}
      >
        Endpoints
      </Typography>
      <Stack gap={1} mb={5}>
        {groups.map((group) => (
          <Accordion
            key={group.label}
            defaultExpanded
            disableGutters
            variant="outlined"
            sx={{
              "&:before": { display: "none" },
              bgcolor: "background.paper",
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" gap={1.5}>
                <Typography fontWeight={600} fontSize={14}>
                  {group.label}
                </Typography>
                <Chip
                  label={group.endpoints.length}
                  size="small"
                  sx={{ bgcolor: "action.selected", height: 20, fontSize: 11 }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Divider />
              <Table size="small">
                <TableBody>
                  {group.endpoints.map((e, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell sx={{ width: 90, pl: 2 }}>
                        <MethodChip method={e.method} />
                      </TableCell>
                      <TableCell sx={{ width: "35%" }}>
                        <CodeSpan>{e.path}</CodeSpan>
                      </TableCell>
                      <TableCell sx={{ width: 110 }}>
                        <Stack direction="row" alignItems="center" gap={0.5}>
                          {e.auth ? (
                            <>
                              <LockOutlinedIcon
                                sx={{ fontSize: 13, color: "warning.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="warning.main"
                                fontWeight={500}
                              >
                                JWT
                              </Typography>
                            </>
                          ) : (
                            <>
                              <PublicOutlinedIcon
                                sx={{ fontSize: 13, color: "success.main" }}
                              />
                              <Typography
                                variant="caption"
                                color="success.main"
                                fontWeight={500}
                              >
                                Public
                              </Typography>
                            </>
                          )}
                        </Stack>
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
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>

      {/* ── Quick reference ── */}
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ mb: 1.5, display: "block" }}
      >
        Quick reference
      </Typography>
      <Grid container spacing={2} mb={5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="white"
              mb={1.5}
            >
              Response envelope
            </Typography>
            <CodeBlock>{`// Success
{ "data": <T>, "error": null }

// Error
{
  "data": null,
  "error": {
    "code": "string",
    "message": "string"
  }
}`}</CodeBlock>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper variant="outlined" sx={{ p: 2.5, height: "100%" }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="white"
              mb={1.5}
            >
              Authentication header
            </Typography>
            <CodeBlock>{`Authorization: Bearer <token>`}</CodeBlock>
            <Alert
              severity="info"
              variant="outlined"
              sx={{ mt: 2, fontSize: 12 }}
            >
              Obtain tokens via Supabase Auth in the mobile app. Tokens expire
              after 1 hour and refresh automatically.
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      {/* ── Footer ── */}
      <Divider sx={{ mb: 3 }} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">
          app-template · v1.1.0
        </Typography>
        <Link
          href="/api/health"
          underline="hover"
          variant="body2"
          color="primary"
        >
          Health check →
        </Link>
      </Stack>
    </Container>
  );
}
