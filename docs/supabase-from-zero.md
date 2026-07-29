# Supabase setup for SETI

This guide configures the public SETI website with Supabase Postgres and Storage. The application has one public flow; there are no admin routes or write APIs.

## 1. Create a Supabase project

1. Create a project at [database.new](https://database.new).
2. Save the database password.
3. Choose a region close to your users.

## 2. Configure the database connection

Copy `.env.example` to `.env.local` and set `DATABASE_URL` to the Postgres connection string from the Supabase Connect dialog:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres?sslmode=require
```

For serverless deployment, use the shared pooler transaction-mode connection string when appropriate. `DATABASE_URL` is the only required variable for the current application.

## 3. Create the schema

In Supabase SQL Editor, run [`drizzle/0000_seti_schema.sql`](/C:/Users/rafae/Downloads/seti-project/drizzle/0000_seti_schema.sql).

If the original schema was already created before `class_image` was added, also run [`drizzle/0001_add_class_image.sql`](/C:/Users/rafae/Downloads/seti-project/drizzle/0001_add_class_image.sql). Run [`drizzle/0003_remove_class_year.sql`](/C:/Users/rafae/Downloads/seti-project/drizzle/0003_remove_class_year.sql) after the previous migrations to remove the obsolete class year.

The schema contains:

- `seti_events`
- `classes`
- `criteria`
- `speakers`
- `contacts`
- `speaker_contacts`
- `event_days`
- `class_criteria`

## 4. Configure image storage

Create these public Storage buckets:

- `seti-speakers`
- `seti-criteria`
- `seti-contacts`
- `seti-classes`

Upload images and store their public URLs in `speaker_image`, `criteria_image`, `contact_icon`, and `class_image`.

## 5. Add event data

Because the application no longer exposes admin or write APIs, populate event data directly through Supabase SQL Editor or a controlled migration process. Insert records in this order:

1. `seti_events`
2. `classes` (identified by `class_number` and `class_letter`; classes are not tied to an event year)
3. `criteria`
4. `speakers`
5. `contacts`
6. `speaker_contacts`
7. `event_days`
8. `class_criteria`

The public pages read this data through the server-side service. If the database is unavailable or empty, they render fallback content.

## 6. Verify locally

```bash
npm install
npm run dev
```

Open:

- `http://localhost:3000/`
- `http://localhost:3000/criteria`
- `http://localhost:3000/hall`
- `http://localhost:3000/individual-evaluation`
- `http://localhost:3000/api/health/database`

The health endpoint returns `200` when the database is reachable and `503` when it is not configured or unavailable.
