// Copies supabase/migrations/ into apps/api/migrations/ so the files are
// available in the Vercel deployment bundle.
const { cpSync, mkdirSync } = require("fs");
const path = require("path");

const src = path.join(__dirname, "../../../supabase/migrations");
const dst = path.join(__dirname, "../migrations");

mkdirSync(dst, { recursive: true });
cpSync(src, dst, { recursive: true, force: true });
console.log(`Copied migrations: ${src} → ${dst}`);
