import { createFileRoute, redirect } from "@tanstack/react-router";
import * as v from "valibot"
import { storage } from "../lib/storage";
import { auth, redirectUrl } from "../lib/auth";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: v.object({
    code: v.string()
  }),

  beforeLoad: async ({ search }) => {
    const challenge = storage.local.getItem("challenge");
    storage.local.removeItem("challenge");

    const exchanged = await auth.exchange(
      search.code,
      redirectUrl(),
      challenge?.verifier
    );

    if (exchanged.err) {
      throw new Error("Failed to exchange code");
    }

    storage.local.setItem("access_token", exchanged.tokens.access);
    storage.local.setItem("refresh_token", exchanged.tokens.refresh);

    return redirect({
      to: "/"
    })
  }
});


