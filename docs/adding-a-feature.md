# Adding a New Feature

Step-by-step guide for adding a feature to the app. Works for both humans and AI agents.

## Example: Adding a "Notes" Feature

### 1. Define Types

```typescript
// packages/types/src/notes.ts
export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}
```

Re-export from `packages/types/src/index.ts`.

### 2. Create Database Migration

```bash
pnpm supabase:migration create_notes_table
```

```sql
-- supabase/migrations/YYYYMMDDHHMMSS_create_notes_table.sql
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON public.notes(user_id);

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own notes"
  ON public.notes FOR ALL
  USING (auth.uid() = user_id);
```

Apply: `pnpm supabase:reset`

### 3. Create API Routes

```typescript
// apps/api/app/api/notes/route.ts
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase";
import { errorResponse } from "@/lib/errors";
import type { ApiResponse, Note } from "@app-template/types";

export async function GET(request: Request): Promise<NextResponse<ApiResponse<Note[]>>> {
  try {
    const { userId } = await requireAuth(request);
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return errorResponse(error);
  }
}
```

### 4. Create Mobile Hook

```typescript
// apps/mobile/hooks/useNotes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Note, CreateNoteInput, ApiResponse } from "@app-template/types";

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Note[]>>("/api/notes");
      return data.data;
    },
  });
}
```

### 5. Create Mobile Screen

```typescript
// apps/mobile/app/(app)/notes.tsx
export default function NotesScreen() { ... }
```

### 6. Add Tests

- API: `apps/api/__tests__/notes.test.ts`
- Mobile: `apps/mobile/__tests__/useNotes.test.ts`

### 7. Update Documentation

If the feature introduces new conventions, update `CLAUDE.md` and `AGENTS.md`.
