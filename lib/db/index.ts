import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "";

const isConfigured = Boolean(connectionString);

// Create the postgres connection
const client = isConfigured ? postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
}) : null;

// Create the Drizzle instance
export const db = client ? drizzle(client, { schema }) : null;

export * from "./schema";
