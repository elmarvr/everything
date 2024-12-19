import { createSubjects } from "@openauthjs/openauth";
import * as v from "valibot";

export const subjects = createSubjects({
  user: v.object({
    userId: v.number(),
  }),
  anonymous: v.object({}),
});

export type Subjects = typeof subjects;
