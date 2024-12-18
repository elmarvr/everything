import { authorizer } from "@openauthjs/openauth";
import { subjects } from "./subject";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { Resource } from "sst";
import type { ExecutionContext } from "@cloudflare/workers-types";
import { GithubAdapter } from "@openauthjs/openauth/adapter/github";

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

    return auth.fetch(request, env, ctx);
  },
};
