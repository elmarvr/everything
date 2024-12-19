import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../drizzle/types";

export const userTable = sqliteTable("users", {
  ...id,
  name: text().notNull(),
  email: text(),
  githubId: integer().notNull(),
  ...timestamps,
});
