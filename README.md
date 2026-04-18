# The Black Star Journal (BSJ)

The Black Star Journal is a digital publication and archive centering Black stories, art, and community at Brown University and RISD.

Live site: https://black-star-journal.vercel.app

## Mission and purpose

BSJ exists to document, preserve, and amplify Black life on campus.

- Center Black voices in journalism, storytelling, and creative work.
- Build an intentional record of Black student life that future generations can find and learn from.
- Celebrate Black joy, brilliance, struggle, and collective memory.
- Create an editorial space not limited by a white institutional lens.

As described in the site's own copy, BSJ is both a publication and a living archive.

## Historical context

BSJ sits inside a longer lineage of Black student publishing at Brown:

- Uwezo (1970-1993): official publication of the Organization of United African People (now BSU).
- Blacks on Paper (BOP) (1972-1975): Black student literary publication.
- African Sun (1991-2010): monthly Black cultural publication of OUAP/BSU.

BSJ itself was co-founded in 2021 by Amiri Nash ('24) and Keiley Thompson ('24), and launched its first issue in February 2022.

The project's origin story is core to its purpose: after searching Brown archives and finding little evidence of Black student life, the founders created BSJ to fill that silence with a durable public record. From day one, BSJ positioned itself as Brown's first Black student newspaper, centering Black joy, Black accomplishment, and Black life on its own terms.

## What the site includes

- Home: mission statement, current issue highlights, and founding story context.
- Full BSJ Issues: issue timeline and PDF reading experience.
- Sections + Pieces: web-native reading views for articles, poems, columns, stories, and snapshots.
- Archives: legacy publication context plus African Sun archival issues.
- Events: community programming and visual documentation.
- Team: editorial masthead and co-founder narrative.

## Repository layout

This workspace has two main apps:

- `black-star-cms/`: Payload CMS backend (Next.js app).
- `frontend/`: Vite + React frontend delivered on Vercel.

## Tech stack

### Backend (`black-star-cms`)

- Payload CMS v3
- Next.js 15
- MongoDB via `@payloadcms/db-mongodb`
- Lexical rich text via `@payloadcms/richtext-lexical`
- S3-compatible media storage via `@payloadcms/storage-s3` (Cloudflare R2-compatible)

### Frontend (`frontend`)

- React 19 + TypeScript
- Vite 7
- React Router
- Tailwind CSS v4
- React PDF (`react-pdf` + `pdfjs-dist`) for issue/PDF reading

## CMS content model (Payload)

Configured collections include:

- `users`: authenticated admin/editor/author users.
- `media`: images, PDF uploads, and metadata (alt text, captions, asset type, credits).
- `bsjissues`: BSJ issue metadata, cover artwork, and full PDF.
- `sections`: issue sections (Columns, Art and Culture, Society and News, Local, Stories).
- `pieces`: issue pieces/articles with rich text body and optional custom content blocks.
- `africansun`: archived African Sun publication entries.

Custom rich-text blocks are enabled for piece bodies:

- `ArtworkBlock`
- `PullQuoteBlock`
- `VisualTypographyBlock`

## Local development

### Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm
- MongoDB (local or Atlas)

### 1) Start the CMS backend

```bash
cd black-star-cms
npm install
npm run dev
```

By default this runs at:

- API + admin: http://localhost:3000
- Admin route: http://localhost:3000/admin

### 2) Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

By default this runs at:

- Frontend: http://localhost:5000

## Environment variables

Create `.env` files in both app folders.

### `black-star-cms/.env`

```env
DATABASE_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PAYLOAD_SECRET=<long-random-secret>

# Public/server URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5000

# Browser allowlists for CORS/CSRF
FRONTEND_URL=http://localhost:5000
CORS_ORIGINS=http://localhost:5000,https://black-star-journal.vercel.app

# S3-compatible storage (Cloudflare R2 or equivalent)
S3_ACCESS_KEY_ID=<key>
S3_SECRET_ACCESS_KEY=<secret>
S3_BUCKET=<bucket>
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
```

### `frontend/.env`

```env
# Backend API base URL (Render URL in production)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Public asset base URL for media files (R2 public domain)
NEXT_PUBLIC_R2_URL=https://<public-r2-domain>
```

## Important API endpoints used by the frontend

- `/api/bsjissues`
- `/api/sections`
- `/api/pieces`
- `/api/africansun`
- `/api/media`

Payload also exposes GraphQL routes under `/api/graphql`.

## Deployment

### Frontend on Vercel

Production frontend URL:

- https://black-star-journal.vercel.app

Recommended Vercel project settings:

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist/public`

Set frontend environment variables in Vercel:

- `NEXT_PUBLIC_API_URL=https://<your-render-service>.onrender.com`
- `NEXT_PUBLIC_R2_URL=https://<your-public-r2-domain>`

`frontend/vercel.json` rewrites all routes to `index.html` so client-side routing works on refresh.

### Backend on Render

Deploy `black-star-cms` as a web service.

Option A (native Node service):

- Root directory: `black-star-cms`
- Build command: `npm ci && npm run build`
- Start command: `npm start`

Option B (Docker service):

- Use `black-star-cms/Dockerfile`

Required env vars on Render include:

- `DATABASE_URI`
- `PAYLOAD_SECRET`
- `NEXT_PUBLIC_SERVER_URL=https://<your-render-service>.onrender.com`
- `NEXT_PUBLIC_FRONTEND_URL=https://black-star-journal.vercel.app`
- `FRONTEND_URL=https://black-star-journal.vercel.app`
- `CORS_ORIGINS=https://black-star-journal.vercel.app`
- `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_ENDPOINT`

### CORS/CSRF note

If the frontend can reach the API URL but browser requests fail, verify that the deployed frontend domain is present in `CORS_ORIGINS` and related frontend URL allowlists. Payload CORS and CSRF settings are derived from these values.

## PDF viewer asset pipeline

The frontend uses `react-pdf` and needs PDF.js support assets.

- `frontend/copy-pdf-worker.js` copies PDF.js assets into:
  - `frontend/public/cmaps`
  - `frontend/public/standard_fonts`
  - `frontend/public/pdfjs`
- This runs automatically via frontend `postinstall`.

## Useful commands

### Backend (`black-star-cms`)

- `npm run dev`: start Payload + Next in development.
- `npm run build`: production build.
- `npm start`: run production server.
- `npm run test:int`: integration test.
- `npm run generate:types`: regenerate Payload TypeScript types.

### Frontend (`frontend`)

- `npm run dev`: start Vite dev server on port 5000.
- `npm run build`: production build.
- `npm run preview`: preview production build.
- `npm run check`: TypeScript check.

## Troubleshooting

### Frontend cannot fetch API in production

- Confirm `NEXT_PUBLIC_API_URL` points to Render backend URL.
- Confirm backend allowlists include `https://black-star-journal.vercel.app`.

### Media URLs are broken

- Confirm `NEXT_PUBLIC_R2_URL` is set in frontend.
- Confirm S3/R2 credentials and bucket settings are correct in backend.

### PDF viewer fonts/cmaps missing

- Re-run frontend install to trigger `postinstall` copy step:

```bash
cd frontend
npm install
```

### Security and secrets

- Keep all `.env` files out of source control.
- Do not use default/test credentials in production.
- Rotate secrets immediately if credentials are ever exposed.

## Acknowledgment

BSJ is built by and for Black students, writers, artists, and community members. This codebase supports that editorial mission by keeping publishing, archiving, and public access in one continuous system.
