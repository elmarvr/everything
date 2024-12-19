import { eq } from "../drizzle";
import { useTransaction } from "../drizzle/transaction";
import { schemaFn } from "../utils/schema-fn";
import { userTable } from "./user.sql";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";

export namespace User {
  export const Info = createSelectSchema(userTable, {
    email: () => v.nullable(v.pipe(v.string(), v.email())),
  });

  export const fromGithubId = schemaFn(Info.entries.githubId, (githubId) => {
    return useTransaction(async (tx) => {
      return tx
        .select()
        .from(userTable)
        .where(eq(userTable.githubId, githubId))
        .then((rows) => rows[0]);
    });
  });

  export const fromId = schemaFn(Info.entries.id, (id) => {
    return useTransaction(async (tx) => {
      return tx
        .select()
        .from(userTable)
        .where(eq(userTable.id, id))
        .then((rows) => rows[0]);
    });
  });

  const UserInsert = createInsertSchema(userTable);

  export const create = schemaFn(UserInsert, (input) => {
    return useTransaction(async (tx) => {
      return tx
        .insert(userTable)
        .values(input)
        .returning({
          id: userTable.id,
        })
        .then((rows) => rows[0]);
    });
  });
}
