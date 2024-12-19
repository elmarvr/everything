import { integer } from "drizzle-orm/sqlite-core";

export const id = {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
};

export const timestamps = {
  updatedAt: integer({
    mode: "timestamp",
  })
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: integer({
    mode: "timestamp",
  })
    .$default(() => new Date())
    .notNull(),

  deletedAt: integer({
    mode: "timestamp",
  }).$default(() => new Date()),
};
