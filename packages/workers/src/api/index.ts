import { List } from "@everything/core/list";
import { createClient } from "@openauthjs/openauth/client";
import { Hono, type MiddlewareHandler } from "hono";
import { cors } from "hono/cors";
import { Resource } from "sst";
import { subjects } from "../subject";
import { ActorContext } from "@everything/core/actor";
import { vValidator } from "@hono/valibot-validator";

export const auth: MiddlewareHandler = async (c, next) => {
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

    return ActorContext.with(result.subject, next);
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

const routes = app
  .get("/list", async (c) => {
    const lists = await List.list();
    return c.json({ lists });
  })
  .post("/list", vValidator("json", List.create.schema), async (c) => {
    const input = c.req.valid("json");
    const list = await List.create(input);

    return c.json({ list });
  })
  .get("/list/:id", async (c) => {
    const id = c.req.param("id");
    const list = await List.fromId(parseInt(id));

    return c.json({ list });
  });

export type ApiType = typeof routes;

export default {
  fetch: routes.fetch,
};
