# SETI

Public SETI event website built with Next.js, React, Tailwind CSS, Drizzle ORM, and PostgreSQL.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verify

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Configuration

Copy `.env.example` to `.env.local` and configure `DATABASE_URL` for live event data. Without a database connection, the public pages render their built-in fallback content.

Database setup and public API details are documented in [`docs/backend.md`](docs/backend.md).
