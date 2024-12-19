import type { Subjects } from "@everything/workers/subject";
import * as v from "valibot";
import { createContext } from "./context";

export type Actor = {
  [K in keyof Subjects]: {
    type: K;
    properties: v.InferOutput<Subjects[K]>;
  };
}[keyof Subjects];

export const ActorContext = createContext<Actor>();

export function useUserId() {
  const actor = ActorContext.use();

  if (actor.type === "user") {
    return actor.properties.userId;
  }

  throw new Error("Not a user");
}

export function useActor() {
  try {
    return ActorContext.use();
  } catch {
    return { type: "public", properties: {} } as Extract<
      Actor,
      { type: "public" }
    >;
  }
}

export function assertActor<T extends Actor["type"]>(type: T) {
  const actor = useActor();
  if (actor.type !== type) {
    throw new Error(`Actor is not "${type}"`);
  }

  return actor as Extract<Actor, { type: T }>;
}
