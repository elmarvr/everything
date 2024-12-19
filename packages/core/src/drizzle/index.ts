import { drizzle as drizzleClient } from "drizzle-orm/d1";
import { Resource } from "sst";
import type { MiddlewareHandler } from "hono";

export function createDb() {
  return drizzleClient(Resource.DB);
}

export const drizzle = (): MiddlewareHandler => async (c, next) => {
  c.set("drizzle", createDb());
  return next();
};

declare module "hono" {
  interface ContextVariableMap {
    drizzle: ReturnType<typeof createDb>;
  }
}

export * from "drizzle-orm/expressions";
