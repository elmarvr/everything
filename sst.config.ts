/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "everything-3",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "cloudflare",
    };
  },
  async run() {
    const secret = {
      GithubClientId: new sst.Secret("GithubClientId"),
      GithubClientSecret: new sst.Secret("GithubClientSecret"),
    };

    const kv = new sst.cloudflare.Kv("KV", {});

    const auth = new sst.cloudflare.Worker("Auth", {
      handler: "./packages/workers/src/auth.ts",
      link: [kv, secret.GithubClientId, secret.GithubClientSecret],
      url: true,
    });

    const issuer = new sst.Linkable("Issuer", {
      properties: {
        url: auth.url.apply((url) => url!),
      },
    });

    const api = new sst.cloudflare.Worker("Api", {
      handler: "./packages/workers/src/api/index.ts",
      link: [kv, auth, issuer],
      url: true,
    });

    const web = new sst.cloudflare.StaticSite("Web", {
      path: "./packages/web",
      environment: {
        VITE_ISSUER_URL: issuer.properties.url,
        VITE_API_URL: api.url.apply((url) => url!),
      },
    });

    return {
      auth: auth.url,
      api: api.url,
      web: web.url,
    };
  },
});
