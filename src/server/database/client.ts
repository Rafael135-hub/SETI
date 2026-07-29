import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { schema } from "./schema";

type Database = NodePgDatabase<typeof schema>;

const globalForDatabase = globalThis as typeof globalThis & {
  __setiDatabase?: Database;
  __setiPool?: Pool;
};

function getConnectionString() {
  const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL. Add your Supabase Postgres connection string before using the API.",
    );
  }

  return connectionString;
}

export function hasDatabaseConnectionConfig() {
  return Boolean(process.env.DATABASE_URL ?? process.env.SUPABASE_DB_URL);
}

function shouldUseSsl(connectionString: string) {
  return !connectionString.includes("sslmode=disable") && !connectionString.includes("localhost");
}

export function getPool() {
  if (globalForDatabase.__setiPool) {
    return globalForDatabase.__setiPool;
  }

  const connectionString = getConnectionString();
  const pool = new Pool({
    connectionString,
    ssl: shouldUseSsl(connectionString) ? { rejectUnauthorized: false } : undefined,
  });

  globalForDatabase.__setiPool = pool;

  return pool;
}

export function getDatabase() {
  if (globalForDatabase.__setiDatabase) {
    return globalForDatabase.__setiDatabase;
  }

  const database = drizzle(getPool(), { schema });

  globalForDatabase.__setiDatabase = database;

  return database;
}
