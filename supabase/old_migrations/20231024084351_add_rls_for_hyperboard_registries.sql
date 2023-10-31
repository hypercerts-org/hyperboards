alter table "public"."hyperboard_registries" drop constraint "hyperboard_registries_registries_id_fkey";

alter table "public"."hyperboard_registries" drop constraint "hyperboard_registries_pkey";

drop index if exists "public"."hyperboard_registries_pkey";

alter table "public"."hyperboard_registries" drop column "registries_id";

alter table "public"."hyperboard_registries" add column "registry_id" uuid not null;

CREATE UNIQUE INDEX hyperboard_registries_pkey ON public.hyperboard_registries USING btree (hyperboard_id, registry_id);

alter table "public"."hyperboard_registries" add constraint "hyperboard_registries_pkey" PRIMARY KEY using index "hyperboard_registries_pkey";

alter table "public"."hyperboard_registries" add constraint "hyperboard_registries_registry_id_fkey" FOREIGN KEY (registry_id) REFERENCES registries(id) not valid;

alter table "public"."hyperboard_registries" validate constraint "hyperboard_registries_registry_id_fkey";

create policy "Only allow for owner of the hyperboard"
on "public"."hyperboard_registries"
as permissive
for insert
to public
with check (((auth.jwt() ->> 'address'::text) IN ( SELECT hyperboards.admin_id
   FROM hyperboards
  WHERE (hyperboard_registries.hyperboard_id = hyperboards.id))));
