import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const storageBucketNames = {
  speakers: "SUPABASE_STORAGE_BUCKET_SPEAKERS",
  criteria: "SUPABASE_STORAGE_BUCKET_CRITERIA",
  contacts: "SUPABASE_STORAGE_BUCKET_CONTACTS",
  classes: "SUPABASE_STORAGE_BUCKET_CLASSES",
} as const;

export type StorageBucket = keyof typeof storageBucketNames;

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}.`);
  }

  return value;
}

export function getSupabaseUrl() {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL").replace(/\/$/, "");
}

export function getSupabaseAnonKey() {
  return getRequiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export function getSupabaseServiceRoleKey() {
  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getStorageBucket(bucket: StorageBucket) {
  return getRequiredEnv(storageBucketNames[bucket]);
}

export function getSupabasePublicClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Server-only. Never import this from a Client Component or expose its key. */
export function getSupabaseAdminClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function resolveStorageUrl(bucket: StorageBucket, value: string | null | undefined) {
  if (!value) {
    return value ?? null;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const encodedPath = value
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${getSupabaseUrl()}/storage/v1/object/public/${encodeURIComponent(getStorageBucket(bucket))}/${encodedPath}`;
}

export function getSupabaseConfigurationStatus() {
  const has = (name: string) => Boolean(process.env[name]?.trim());

  return {
    urlConfigured: has("NEXT_PUBLIC_SUPABASE_URL"),
    anonKeyConfigured: has("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    serviceRoleConfigured: has("SUPABASE_SERVICE_ROLE_KEY"),
    buckets: {
      speakers: has(storageBucketNames.speakers),
      criteria: has(storageBucketNames.criteria),
      contacts: has(storageBucketNames.contacts),
      classes: has(storageBucketNames.classes),
    },
  };
}
