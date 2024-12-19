import type { ApiType } from "@everything/workers/api";
import { hc } from "hono/client";
import { storage } from "./storage";

export const api = hc<ApiType>(import.meta.env.VITE_API_URL, {
  headers() {
    const accessToken = storage.local.getItem("access_token");

    return {
      authorization: `Bearer ${accessToken}`,
    };
  },
}).api;
