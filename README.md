# hairstyle-ai

Next.js 16 app with a dedicated `/try-on` flow:
- Upload target portrait.
- Choose hairstyle from curated Cloudinary presets or upload custom source.
- Submit to VModel AI hairstyle model.
- Poll task status and preview/download result.

## Requirements

- Node.js 20+
- VModel API token
- Cloudinary account (for presets and uploads)

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in all variables:

```bash
VMODEL_API_TOKEN=
VMODEL_MODEL_VERSION=5c0440717a995b0bbd93377bd65dbb4fe360f67967c506aa6bd8f6b660733a7e
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
