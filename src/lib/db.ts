import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** True when everything the app needs at runtime is present. */
export function isAppConfigured(): boolean {
  return isDbConfigured() && Boolean(process.env.AUTH_SECRET);
}

export function getSql(): NeonQueryFunction<false, false> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.",
    );
  }
  if (!cached) {
    cached = neon(url);
  }
  return cached;
}
