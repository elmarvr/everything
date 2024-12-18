import { createClient } from "@openauthjs/openauth/client";

export const auth = createClient({
  clientID: "web",
  issuer: import.meta.env.VITE_AUTH_URL,
});

export function redirectUrl() {
  return `${window.location.protocol}//${window.location.host}/auth/callback`;
}
