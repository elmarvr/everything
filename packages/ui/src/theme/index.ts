import { createTamagui, createTokens } from "@tamagui/core";

const size = {
  $0: 0,
  $px: 1,
  "$0.5": 2,
  $1: 4,
  "$1.5": 6,
  $2: 8,
  "$2.5": 10,
  $3: 12,
  $4: 16,
  $5: 20,
  $6: 24,
  $7: 28,
  $8: 32,
  $9: 36,
  $10: 40,
  $12: 48,
  $14: 56,
  $16: 64,
  $20: 80,
  $24: 96,
};

function toNegative<T extends Record<PropertyKey, number>>(
  obj: T
): Omit<
  {
    [K in keyof T as `-${string & K}`]: number;
  },
  "-0"
> {
  const result: Record<string, number> = {};

  for (const key in obj) {
    result[key === "0" ? key : `-${key}`] = -obj[key];
  }

  return result as any;
}

export const tokens = createTokens({
  size,
  space: {
    ...toNegative(size),
    ...size,
  },
  radius: {
    0: 0,
  },
  zIndex: {
    0: 0,
  },
  color: {
    white: "#fff",
    black: "#000",
  },
});

const config = createTamagui({
  tokens,
  shorthands: {
    p: "padding",
    px: "paddingHorizontal",
    py: "paddingVertical",
    pt: "paddingTop",
    pr: "paddingRight",
    pb: "paddingBottom",
    pl: "paddingLeft",

    m: "margin",
    mx: "marginHorizontal",
    my: "marginVertical",
    mt: "marginTop",
    mr: "marginRight",
    mb: "marginBottom",
    ml: "marginLeft",

    w: "width",
    maxW: "maxWidth",
    h: "height",
    maxH: "maxHeight",

    bg: "backgroundColor",

    grow: "flexGrow",
    shrink: "flexShrink",
    gapX: "columnGap",
    gapY: "rowGap",

    border: "border",
    borderT: "borderTop",
    borderR: "borderRight",
    borderB: "borderBottom",
    borderL: "borderLeft",

    rounded: "borderRadius",

    z: "zIndex",
  } as const,
});

type AppConfig = typeof config;

declare module "@tamagui/core" {
  interface TamaguiConfig extends AppConfig {}
}

export default config;
