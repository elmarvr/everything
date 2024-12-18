import * as v from "valibot";

class TypedStorage<TConfig extends Record<string, v.GenericSchema>> {
  private config: TConfig;
  private storage: Storage;

  constructor(storage: Storage, config: TConfig) {
    this.storage = storage;
    this.config = config;
  }

  get length() {
    return this.storage.length;
  }

  key(index: number) {
    return this.storage.key(index);
  }

  getItem<TKey extends keyof TConfig>(key: TKey & string) {
    const value = this.storage.getItem(key);

    if (!value) {
      return null;
    }

    try {
      return v.parse(this.config[key], JSON.parse(value));
    } catch {
      return null;
    }
  }

  setItem<TKey extends keyof TConfig>(
    key: TKey & string,
    value: v.InferInput<TConfig[TKey]>
  ) {
    return this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    return this.storage.removeItem(key);
  }

  clear() {
    return this.storage.clear();
  }
}

export const storage = {
  local: new TypedStorage(localStorage, {
    challenge: v.object({
      state: v.string(),
      verifier: v.optional(v.string()),
    }),
    access_token: v.string(),
    refresh_token: v.string(),
  }),
};
