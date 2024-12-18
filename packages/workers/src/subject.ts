import { createSubjects } from "@openauthjs/openauth";
import * as v from "valibot";

export const subjects = createSubjects({
  user: v.object({
    userId: v.string(),
  }),
});
