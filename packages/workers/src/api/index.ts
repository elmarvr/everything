import { createClient } from "@openauthjs/openauth/client";
import { Hono, type ExecutionContext, type MiddlewareHandler } from "hono";
import { Resource } from "sst";
import { subjects } from "../subject";
import { cors } from "hono/cors";

export const auth = async (c, next) => {
  console.log("authHeader", "213");
  const authHeader =
    c.req.header("authorization") ?? c.req.query("authorization");

  if (authHeader) {
    const match = authHeader.match(/^Bearer (.+)$/);

    if (!match || !match[1]) {
      return await next();
    }

    const bearerToken = match[1];

    const client = createClient({
      issuer: Resource.Issuer.url,
      clientID: "api",
      fetch: (input, init) => {
        return Resource.Auth.fetch(input, init);
      },
    });

    const result = await client.verify(subjects, bearerToken);

    if (result.err) {
      return next();
    }

    c.set("actor", result.subject);

    return next();
  }

  return next();
};

const app = new Hono()
  .use(
    cors({
      origin: ["http://localhost:3001"],
    })
  )
  .use(auth)
  .basePath("/api");

const routes = app.get("auth/me", async (c) => {
  const actor = c.get("actor");

  return c.json({ actor });
});
export type ApiType = typeof routes;

export default {
  fetch: (request: Request, env: {}, ctx: ExecutionContext) => {
    return routes.fetch(request, env, ctx);
  },
};
