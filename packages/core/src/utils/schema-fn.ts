import * as v from "valibot";

export function schemaFn<TSchema extends v.GenericSchema, TReturn>(
  schema: TSchema,
  fn: (input: v.InferOutput<TSchema>) => TReturn
) {
  const result = function (input: v.InferOutput<TSchema>): TReturn {
    const parsed = v.parse(schema, input);
    return fn.apply(fn, [parsed]);
  };

  result.schema = schema;

  return result;
}
