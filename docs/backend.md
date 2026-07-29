# SETI backend

The application exposes a single public flow. Public pages read event data on the server and fall back to built-in placeholder content when the database is unavailable.

## Environment

Create `.env.local` from `.env.example` and set:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

Use the Supabase Postgres connection string, not the REST URL. The shared pooler connection can be used when the direct connection is unavailable.

## Database setup

1. Create a Supabase project.
2. Run [`drizzle/0000_seti_schema.sql`](/C:/Users/rafae/Downloads/seti-project/drizzle/0000_seti_schema.sql) in the SQL editor.
3. If the original schema was already applied, also run [`drizzle/0001_add_class_image.sql`](/C:/Users/rafae/Downloads/seti-project/drizzle/0001_add_class_image.sql).

## Storage

Create these public buckets if database records will reference uploaded images:

- `seti-speakers`
- `seti-criteria`
- `seti-contacts`
- `seti-classes`

Store the resulting public URLs in `speaker_image`, `criteria_image`, `contact_icon`, and `class_image`.

## Public routes

- `GET /api/public/current-event`
- `GET /api/public/current-event?year=2026`
- `GET /api/public/criteria`
- `GET /api/public/schedule`
- `GET /api/public/leaderboard`
- `GET /api/public/leaderboard?limit=3`
- `GET /api/health/database`

When no event filter is supplied, public routes use the latest open event and then fall back to the latest event by year.

The public pages are `/`, `/criteria`, `/hall`, and `/individual-evaluation`.
