import type { ExecutionContext } from "@cloudflare/workers-types";
import { authorizer } from "@openauthjs/openauth";
import { GithubAdapter } from "@openauthjs/openauth/adapter/github";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { Resource } from "sst";
import * as v from "valibot";
import { subjects } from "./subject";
import { createDrizzle } from "@everything/core/drizzle";
import { User } from "@everything/core/user";

export default {
  async fetch(request: Request, env: {}, executionCtx: ExecutionContext) {
    const db = createDrizzle();

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
      success: async (ctx, value) => {
        if (value.provider === "github") {
          const response = await fetch("https://api.github.com/user", {
            headers: {
              "User-Agent": "EverythingApp",
              "X-GitHub-Api-Version": "2022-11-28",
              Authorization: `Bearer ${value.tokenset.access}`,
              Accept: "application/vnd.github+json",
            },
          });

          const githubUser = v.parse(GithubUser, await response.json());
          const existingUser = await User.fromGithubId(githubUser.id);

          if (existingUser) {
            return ctx.subject("user", { userId: existingUser.id });
          }

          const user = await User.create({
            name: githubUser.name,
            email: githubUser.email,
            githubId: githubUser.id,
          });

          return ctx.subject("user", { userId: user.id });
        }

        return ctx.subject("anonymous", {});
      },
    });

    return auth.fetch(request, env, executionCtx);
  },
};

const GithubUser = v.object({
  id: v.number(),
  name: v.string(),
  email: v.nullable(v.string()),
});
