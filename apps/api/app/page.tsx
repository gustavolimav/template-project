export default function HomePage() {
  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>app-template API</h1>
          <span style={styles.badge}>v1.0.0</span>
        </div>

        <p style={styles.description}>
          Backend API for the app-template mobile app. Built with Next.js 15,
          Supabase Auth, and JWT verification.
        </p>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Endpoints</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Path</th>
                <th style={styles.th}>Auth</th>
                <th style={styles.th}>Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>
                    <code style={{ ...styles.code, ...methodColor(e.method) }}>
                      {e.method}
                    </code>
                  </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{e.path}</code>
                  </td>
                  <td style={styles.td}>
                    <span style={e.auth ? styles.authRequired : styles.authPublic}>
                      {e.auth ? "Bearer JWT" : "Public"}
                    </span>
                  </td>
                  <td style={styles.td}>{e.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Response format</h2>
          <pre style={styles.pre}>{`// Success
{ "data": <T>, "error": null }

// Error
{ "data": null, "error": { "code": "string", "message": "string" } }`}</pre>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Authentication</h2>
          <pre style={styles.pre}>{`Authorization: Bearer <supabase_access_token>`}</pre>
          <p style={styles.note}>
            Obtain a token by signing in via the mobile app (Supabase Auth).
            Tokens expire after 1 hour and are refreshed automatically.
          </p>
        </section>

        <footer style={styles.footer}>
          <a href="/api/health" style={styles.link}>
            Health check →
          </a>
        </footer>
      </div>
    </main>
  );
}

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
];

function methodColor(method: string): React.CSSProperties {
  const colors: Record<string, React.CSSProperties> = {
    GET: { color: "#22c55e" },
    POST: { color: "#3b82f6" },
    PUT: { color: "#f59e0b" },
    DELETE: { color: "#ef4444" },
  };
  return colors[method] ?? {};
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#0f0f0f",
    color: "#e5e5e5",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "0 16px",
  },
  container: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "48px 0 80px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
    color: "#ffffff",
  },
  badge: {
    fontSize: 12,
    fontWeight: 600,
    background: "#1a1a1a",
    border: "1px solid #333",
    borderRadius: 6,
    padding: "2px 8px",
    color: "#888",
  },
  description: {
    color: "#888",
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 40,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#666",
    marginBottom: 12,
    margin: "0 0 12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: 14,
    border: "1px solid #222",
    borderRadius: 8,
    overflow: "hidden",
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    background: "#1a1a1a",
    color: "#666",
    fontWeight: 500,
    fontSize: 12,
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    borderBottom: "1px solid #222",
  },
  td: {
    padding: "10px 14px",
    borderBottom: "1px solid #1a1a1a",
    verticalAlign: "middle" as const,
    fontSize: 13,
  },
  trEven: { background: "#111" },
  trOdd: { background: "#0d0d0d" },
  code: {
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: 12,
    background: "#1a1a1a",
    padding: "2px 6px",
    borderRadius: 4,
  },
  authRequired: {
    fontSize: 11,
    fontWeight: 500,
    background: "#1c1a12",
    color: "#d4a017",
    padding: "2px 7px",
    borderRadius: 4,
    border: "1px solid #3a3010",
  },
  authPublic: {
    fontSize: 11,
    fontWeight: 500,
    background: "#0f1f0f",
    color: "#4ade80",
    padding: "2px 7px",
    borderRadius: 4,
    border: "1px solid #1a3a1a",
  },
  pre: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: 8,
    padding: "16px 20px",
    fontSize: 13,
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    color: "#a3e635",
    overflowX: "auto" as const,
    margin: 0,
  },
  note: {
    color: "#666",
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 10,
    marginBottom: 0,
  },
  footer: {
    marginTop: 56,
    paddingTop: 24,
    borderTop: "1px solid #1a1a1a",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: 14,
  },
};
