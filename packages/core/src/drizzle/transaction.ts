import { createDb } from ".";
import { createContext } from "../context";

type Transaction = Parameters<
  Parameters<ReturnType<typeof createDb>["transaction"]>[0]
>[0];

const TransactionContext = createContext<{
  tx: Transaction;
  effects: (() => void | Promise<void>)[];
}>();

export async function createTransaction<T>(
  callback: (tx: Transaction) => Promise<T>
): Promise<T> {
  const db = createDb();

  try {
    const { tx } = TransactionContext.use();
    return callback(tx);
  } catch {
    const effects: (() => void | Promise<void>)[] = [];
    const result = await db.transaction(async (tx) => {
      return TransactionContext.with({ tx, effects }, () => callback(tx));
    });
    await Promise.all(effects.map((x) => x()));
    return result as T;
  }
}

export async function useTransaction<T>(
  callback: (trx: Transaction | ReturnType<typeof createDb>) => Promise<T>
) {
  try {
    const { tx } = TransactionContext.use();
    return callback(tx);
  } catch {
    return callback(createDb());
  }
}

export async function afterTx(effect: () => any | Promise<any>) {
  try {
    const { effects } = TransactionContext.use();
    effects.push(effect);
  } catch {
    await effect();
  }
}
