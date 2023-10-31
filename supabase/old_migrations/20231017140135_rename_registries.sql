ALTER TABLE registries_optimism RENAME TO registries;

ALTER TABLE registries
  ADD COLUMN "chain_id" integer NOT NULL;

ALTER TABLE hyperboard_claims
  ADD COLUMN "chain_id" integer NOT NULL;