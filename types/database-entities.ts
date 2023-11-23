import { Database } from "@/types/database";
import { Database as HypercertsDatabase } from "@/types/hypercerts-database";

export type HyperboardEntity =
  Database["public"]["Tables"]["hyperboards"]["Row"];
export type HyperboardInsert =
  Database["public"]["Tables"]["hyperboards"]["Insert"];

export type RegistryEntity = Database["public"]["Tables"]["registries"]["Row"];
export type RegistryInsert =
  Database["public"]["Tables"]["registries"]["Insert"];

export type ClaimEntity = Database["public"]["Tables"]["claims"]["Row"];
export type ClaimInsert = Database["public"]["Tables"]["claims"]["Insert"];

export type HyperboardRegistryEntity =
  Database["public"]["Tables"]["hyperboard_registries"]["Row"];
export type HyperboardRegistryInsert =
  Database["public"]["Tables"]["hyperboard_registries"]["Insert"];

export type DefaultSponsorMetadataEntity =
  Database["public"]["Tables"]["default_sponsor_metadata"]["Row"];
export type DefaultSponsorMetadataInsert =
  Database["public"]["Tables"]["default_sponsor_metadata"]["Insert"];

export type MarketplaceOrderEntity =
  HypercertsDatabase["public"]["Tables"]["marketplace-orders"]["Row"];

export type BlueprintEntity = Database["public"]["Tables"]["blueprints"]["Row"];
