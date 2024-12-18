import { createFileRoute } from "@tanstack/react-router";
import { auth, redirectUrl } from "../lib/auth";
import { storage } from "../lib/storage";

export const Route = createFileRoute("/auth/sign-in")({
  component: AuthSignInComponent,

  beforeLoad: async () => {
    const { challenge, url } = await auth.authorize(redirectUrl(), "code", {
      pkce: true,
      provider: "github",
    });

    storage.local.setItem("challenge", challenge);

    return {
      githubUrl: url,
    };
  },

  loader: ({ context }) => {
    return {
      githubUrl: context.githubUrl,
    };
  },
});

function AuthSignInComponent() {
  const { githubUrl } = Route.useLoaderData();

  return <a href={githubUrl}>Sign in with Github</a>;
}
