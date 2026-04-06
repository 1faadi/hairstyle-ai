# hairstyle-ai

Next.js 16 app with a dedicated `/try-on` flow:
- Upload target portrait.
- Choose hairstyle from curated Cloudinary-backed AILab presets, or upload a custom hairstyle reference.
- Submit preset jobs to AILab `hairstyle-editor-pro`.
- Submit custom reference jobs to VModel `ai-hairstyle`.
- Dedicated `/nail-art` flow using AILab `ai-nail-art` with source image + prompt fields.
- Supabase email/password auth.
- Guest quota enforcement (3 successful generations per IP, shared across AI Hair + AI Nail Art).
- Poll task status and preview/download result.

## Requirements

- Node.js 20+
- AILab API key
- VModel API token
- Supabase project
- Cloudinary account (for preset thumbnails)

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all variables:

```bash
AILABAPI_API_KEY=
VMODEL_API_TOKEN=
VMODEL_MODEL_VERSION=5c0440717a995b0bbd93377bd65dbb4fe360f67967c506aa6bd8f6b660733a7e
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Optional fallback for newer Supabase key naming:
# NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GUEST_IP_HASH_SALT=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_PRESETS_FOLDER=hairstyle-ai/presets
CLOUDINARY_UPLOADS_FOLDER=hairstyle-ai/uploads
```

`CLOUDINARY_PRESETS_FOLDER` must point to the folder containing hairstyle reference images.
`CLOUDINARY_UPLOADS_FOLDER` is used for temporary source/target uploads needed by VModel.
`GUEST_IP_HASH_SALT` should be a long random string (used to hash client IPs before storage).

## Supabase Migration

Run SQL migrations in:

- `supabase/migrations/20260405_guest_ip_quota.sql`
- `supabase/migrations/20260405211218_fix_consume_guest_credit_ambiguous_column.sql`

This creates:

- `guest_ip_usage`
- `generation_jobs`
- `consume_guest_credit_on_success(...)` RPC

## Reverse Proxy Requirement (VPS)

Guest limits are enforced by client IP. Ensure your proxy forwards real client IP headers (`X-Forwarded-For`, `X-Real-IP` or `CF-Connecting-IP`) to Next.js.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and click any CTA, or open `http://localhost:3000/try-on` directly.

## Internal API Endpoints

- `GET /api/hairstyle/presets`
- `GET /api/hairstyle/quota`
- `POST /api/hairstyle/tasks`
- `GET /api/hairstyle/tasks/[taskId]`
- `GET /api/hairstyle/tasks/[taskId]/result`
- `GET /api/nail-art/quota`
- `POST /api/nail-art/tasks`
- `GET /api/nail-art/tasks/[taskId]`
- `GET /api/nail-art/tasks/[taskId]/result`

Nail Art `POST /api/nail-art/tasks` expects:
- `targetImage` (required file, JPG/JPEG/PNG/WEBP, max 10MB)
- `nailName` (required string, max 500 chars)
- `nailDescription` (required string, max 1000 chars)

Task IDs now use `feature:provider:providerTaskId` (for example `hair:ailab:...`, `nail:ailab:...`).
Legacy `provider:taskId` IDs are still accepted for older Hair jobs.

All provider credentials stay server-side and are never exposed to the client.
