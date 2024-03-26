export const requireEnv = (value: string | undefined, identifier: string) => {
  if (!value) {
    throw new Error(`Required env var ${identifier} does not exist`);
  }
  return value;
};

export const TRADER_CONTRACT = requireEnv(
  process.env.NEXT_PUBLIC_TRADER_CONTRACT,
  "NEXT_PUBLIC_TRADER_CONTRACT",
) as `0x${string}`;

export const HYPERCERTS_MARKETPLACE_API_URL = requireEnv(
  process.env.NEXT_PUBLIC_HYPERCERTS_MARKETPLACE_API_URL,
  "NEXT_PUBLIC_HYPERCERTS_MARKETPLACE_API_URL",
);

export const SUPABASE_URL = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "NEXT_PUBLIC_SUPABASE_URL",
);

export const SUPABASE_ANON_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
);

export const SUPABASE_SERVICE_ROLE_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
  "NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY",
);

export const SUPABASE_HYPERCERTS_URL = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_HYPERCERTS_URL,
  "NEXT_PUBLIC_SUPABASE_HYPERCERTS_URL",
);

export const SUPABASE_HYPERCERTS_ANON_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_HYPERCERTS_ANON_KEY,
  "NEXT_PUBLIC_SUPABASE_HYPERCERTS_ANON_KEY",
);

export const SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY = requireEnv(
  process.env.NEXT_PUBLIC_SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY,
  "NEXT_PUBLIC_SUPABASE_HYPERCERTS_SERVICE_ROLE_KEY",
);

export const NFT_STORAGE_TOKEN = requireEnv(
  process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
  "NEXT_PUBLIC_NFT_STORAGE_TOKEN",
);

export const WEB3_STORAGE_TOKEN = requireEnv(
  process.env.NEXT_PUBLIC_WEB3_STORAGE_TOKEN,
  "NEXT_PUBLIC_WEB3_STORAGE_TOKEN",
);

export const WALLETCONNECT_ID = requireEnv(
  process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  "NEXT_PUBLIC_WALLETCONNECT_ID",
);

export const ALCHEMY_KEY = requireEnv(
  process.env.NEXT_PUBLIC_ALCHEMY_KEY,
  "NEXT_PUBLIC_ALCHEMY_KEY",
);

export const JWT_SECRET = requireEnv(
  process.env.NEXT_PUBLIC_JWT_SECRET,
  "NEXT_PUBLIC_JWT_SECRET",
);

export const ZUZALU_DONATION_SAFE_ADDRESS = requireEnv(
  process.env.NEXT_PUBLIC_ZUZALU_DONATION_SAFE,
  "NEXT_PUBLIC_ZUZALU_DONATION_SAFE",
);

export const EDGECITY_DONATION_SAFE_ADDRESS = requireEnv(
  process.env.NEXT_PUBLIC_EDGECITY_DONATION_SAFE_ADDRESS,
  "EDGECITY_DONATION_SAFE_ADDRESS",
);

export const EAS_CONTRACT_ADDRESS = requireEnv(
  process.env.NEXT_PUBLIC_EAS_CONTRACT_ADDRESS,
  "NEXT_PUBLIC_EAS_CONTRACT_ADDRESS",
);

export const DEFAULT_RENDER_METHOD = "full";

export const NUMBER_OF_UNITS_IN_HYPERCERT = 1n * 10n ** 18n;
