import { authorizer } from "@openauthjs/openauth";
import { subjects } from "./subject";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { Resource } from "sst";
import type { ExecutionContext } from "@cloudflare/workers-types";
import { GithubAdapter } from "@openauthjs/openauth/adapter/github";
import { Hono } from "hono";
import { cors } from "hono/cors";

export default {
  async fetch(request: Request, env: {}, ctx: ExecutionContext) {
    const auth = authorizer({
      storage: CloudflareStorage({
        namespace: Resource.KV,
      }),
      subjects,
      providers: {
        github: GithubAdapter({
          clientID: Resource.GithubClientId.value,
          clientSecret: Resource.GithubClientSecret.value,
          scopes: ["user:email", "read:user"],
        }),
      },

      success: (ctx) => {
        return ctx.subject("user", { userId: "test" });
      },
    });

    const response = await new Hono()
      .use(
        "/*",
        cors({
          origin: ["http://localhost:3001"],
          allowHeaders: ["authorization"],
          allowMethods: ["GET", "OPTIONS"],
        })
      )
      .route("/", auth)
      .fetch(request, env, ctx);

    return response;
  },
};
