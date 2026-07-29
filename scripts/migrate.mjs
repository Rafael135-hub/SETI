import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or SUPABASE_DB_URL is required to run migrations.");
}

const { Client } = pg;
const client = new Client({
  connectionString,
  ssl: connectionString.includes("localhost") ? undefined : { rejectUnauthorized: false },
});

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = resolve(scriptDirectory, "..", "drizzle");
const compatibilityMigrationPath = resolve(migrationsDirectory, "0006_vercel_deploy_compatibility.sql");
const eventDayClassNumbersMigrationPath = resolve(migrationsDirectory, "0007_event_days_use_class_numbers.sql");

try {
  await client.connect();

  const { rows } = await client.query(`
    select exists (
      select 1
      from information_schema.tables
      where table_schema = current_schema()
        and table_name = 'seti_events'
    ) as exists
  `);

  if (!rows[0].exists) {
    for (const filename of [
      "0000_seti_schema.sql",
      "0001_add_class_image.sql",
      "0002_use_uuid_ids.sql",
      "0003_remove_class_year.sql",
      "0004_event_days_use_class_number.sql",
      "0005_use_criteria_quantity.sql",
    ]) {
      await client.query(await readFile(resolve(migrationsDirectory, filename), "utf8"));
      console.log(`Applied ${filename}.`);
    }
  }

  await client.query(await readFile(compatibilityMigrationPath, "utf8"));
  console.log("Applied 0006_vercel_deploy_compatibility.sql.");
  await client.query(await readFile(eventDayClassNumbersMigrationPath, "utf8"));
  console.log("Applied 0007_event_days_use_class_numbers.sql.");
} finally {
  await client.end().catch(() => undefined);
}
