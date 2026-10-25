import { Client } from "pg";

function sslFor(connectionString: string) {
  if (/localhost|127\.0\.0\.1/.test(connectionString)) return undefined;
  return { rejectUnauthorized: false } as const;
}

/** One-shot `SELECT 1`. Does not boot Payload, so it stays cheap. */
export async function pingDatabase(): Promise<number> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL missing");
  }

  const client = new Client({
    connectionString,
    connectionTimeoutMillis: 12_000,
    query_timeout: 8_000,
    ssl: sslFor(connectionString),
  });

  const started = Date.now();
  try {
    await client.connect();
    await client.query("select 1");
    return Date.now() - started;
  } finally {
    await client.end();
  }
}
