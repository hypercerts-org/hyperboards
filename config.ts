export const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const TRADER_CONTRACT = requireEnv(
  process.env.NEXT_PUBLIC_TRADER_CONTRACT,
  "TRADER_CONTRACT",
) as `0x${string}`;

export const DEFAULT_RENDER_METHOD = "full";
