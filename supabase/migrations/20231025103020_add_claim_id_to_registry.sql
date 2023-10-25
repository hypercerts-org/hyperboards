alter table "public"."hyperboards" add column "chain_id" integer not null;

alter table "public"."users" alter column "auth" set default '{}'::json;
