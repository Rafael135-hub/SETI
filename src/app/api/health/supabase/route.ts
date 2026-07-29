import { json } from "@/src/server/api/http";
import { getSupabaseConfigurationStatus } from "@/src/server/supabase/config";

export async function GET() {
  const configuration = getSupabaseConfigurationStatus();
  const configured =
    configuration.urlConfigured &&
    configuration.anonKeyConfigured &&
    configuration.serviceRoleConfigured &&
    Object.values(configuration.buckets).every(Boolean);

  return json(
    {
      ok: configured,
      configured,
      configuration,
    },
    { status: configured ? 200 : 503 },
  );
}
