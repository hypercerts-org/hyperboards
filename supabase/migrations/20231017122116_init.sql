create extension citext
with
  schema extensions;

create table
    public.registries_optimism (
      id uuid not null default gen_random_uuid (),
      created_at timestamp with time zone not null default now(),
      name text not null,
      description text not null,
      admin_id text not null,
      hidden boolean not null default false,
      constraint registries_optimism_pkey primary key (id)
    ) tablespace pg_default;

create table
  public.hyperboard_claims (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    registry_id uuid not null,
    hypercert_id text not null,
    constraint hyperboard_claims_pkey primary key (id),
    constraint hyperboard_claims_registry_id_fkey foreign key (registry_id) references "registries_optimism" (id)
  ) tablespace pg_default;

create table
  public.hyperboard_sponsor_metadata (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    type text not null,
    "companyName" text null,
    "firstName" text null,
    "lastName" text null,
    image text not null,
    address citext not null,
    constraint hyperboard_sponsor_metadata_pkey primary key (id)
  ) tablespace pg_default;
