import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { id, timestamps } from "../drizzle/types";
import { userTable } from "../user/user.sql";

export const listTable = sqliteTable("list", {
  ...id,
  title: text(),
  ...timestamps,
});

export const listMemberTable = sqliteTable("list_member", {
  ...id,
  listId: integer().references(() => listTable.id),
  userId: integer().references(() => userTable.id),
  ...timestamps,
});
