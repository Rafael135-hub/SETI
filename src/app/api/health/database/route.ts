import { sql } from "drizzle-orm";

import { json } from "@/src/server/api/http";
import { getDatabase, hasDatabaseConnectionConfig } from "@/src/server/database";

export async function GET() {
  if (!hasDatabaseConnectionConfig()) {
    return json(
      {
        ok: false,
        configured: false,
        connected: false,
        error: "DATABASE_URL is not configured.",
      },
      { status: 503 },
    );
  }

  try {
    const database = getDatabase();
    await database.execute(sql`select 1`);

    return json({
      ok: true,
      configured: true,
      connected: true,
    });
  } catch (error) {
    console.error("[seti:health:database] connection check failed", error);

    return json(
      {
        ok: false,
        configured: true,
        connected: false,
        error: "Database connection failed.",
      },
      { status: 503 },
    );
  }
}
