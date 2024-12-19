import { getTableColumns } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-valibot";
import * as v from "valibot";
import { useUserId } from "../actor";
import { eq } from "../drizzle";
import { useTransaction } from "../drizzle/transaction";
import { schemaFn } from "../utils/schema-fn";
import { listMemberTable, listTable } from "./list.sql";

export namespace List {
  export const Info = createSelectSchema(listTable);

  export const fromId = schemaFn(Info.entries.id, (id) => {
    return useTransaction(async (tx) => {
      return await tx
        .select(getTableColumns(listTable))
        .from(listTable)
        .where(eq(listTable.id, id));
    });
  });

  export const list = schemaFn(v.void(), async () => {
    const userId = useUserId();
    return useTransaction(async (tx) => {
      return tx
        .select(getTableColumns(listTable))
        .from(listTable)
        .innerJoin(listMemberTable, eq(listTable.id, listMemberTable.listId))
        .where(eq(listMemberTable.userId, userId))
        .then((rows) => rows);
    });
  });

  const Insert = createInsertSchema(listTable);

  export const create = schemaFn(Insert, async (input) => {
    return useTransaction(async (tx) => {
      const list = await tx
        .insert(listTable)
        .values(input)
        .returning({
          id: listTable.id,
        })
        .then((rows) => rows[0]);

      const userId = useUserId();

      await addMember({
        listId: list.id,
        userId,
      });

      return list;
    });
  });

  const MemberInsert = createInsertSchema(listMemberTable);

  export const addMember = schemaFn(MemberInsert, async (input) => {
    return useTransaction(async (tx) => {
      return tx
        .insert(listMemberTable)
        .values(input)
        .returning({
          id: listMemberTable.id,
        })
        .then((rows) => rows[0]);
    });
  });
}
