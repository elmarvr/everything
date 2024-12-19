import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../lib/api";

export const Route = createFileRoute("/")({
  component: HomeComponent,

  loader: async () => {
    const response = await api.list.$get();
    const { lists } = await response.json();

    return {
      lists,
    };
  },
});

function HomeComponent() {
  const { lists } = Route.useLoaderData();

  return (
    <div className="p-2">
      <button
        onClick={() => {
          api.list.$post({
            json: {
              title: "New List",
            },
          });
        }}
      >
        Create button
      </button>
      <ul>
        {lists.map((list) => (
          <li key={list.id}>{list.title}</li>
        ))}
      </ul>
    </div>
  );
}
