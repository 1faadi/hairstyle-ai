# hairstyle-ai

Next.js 16 app with a dedicated `/try-on` flow:
- Upload target portrait.
- Choose hairstyle from curated Cloudinary-backed AILab presets.
- Submit to AILab `hairstyle-editor-pro`.
- Poll task status and preview/download result.

## Requirements

- Node.js 20+
- AILab API key
- Cloudinary account (for preset thumbnails)

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all variables:

```bash
AILABAPI_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_PRESETS_FOLDER=hairstyle-ai/presets
```

`CLOUDINARY_PRESETS_FOLDER` must point to the folder containing hairstyle reference images.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and click any CTA, or open `http://localhost:3000/try-on` directly.

## Internal API Endpoints

- `GET /api/hairstyle/presets`
- `POST /api/hairstyle/tasks`
- `GET /api/hairstyle/tasks/[taskId]`
- `GET /api/hairstyle/tasks/[taskId]/result`

All provider credentials stay server-side and are never exposed to the client.
