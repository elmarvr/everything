import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";

export const Route = createFileRoute("/")({
  component: HomeComponent,

  loader: async () => {
    const response = await api.auth.me.$get();

    const user = await response.text();

    return {
      user,
    };
  },
});

function HomeComponent() {
  const { user } = Route.useLoaderData();

  return <div className="p-2">{JSON.stringify(user)}</div>;
}
