import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Manually load .env.local if needed
config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
