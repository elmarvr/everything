import { defineConfig } from "drizzle-kit";
import { Resource } from "sst";

export default defineConfig({
  schema: "./src/**/*.sql.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: Resource.Cloudflare.accountId,
    databaseId: Resource.Cloudflare.databaseId,
    token: Resource.Cloudflare.token,
  },
});
