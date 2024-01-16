alter table "public"."claims" drop constraint "hyperboard_claims_registry_id_fkey";

alter table "public"."claims" add constraint "claims_registry_id_fkey" FOREIGN KEY (registry_id) REFERENCES registries(id) ON DELETE CASCADE not valid;

alter table "public"."claims" validate constraint "claims_registry_id_fkey";

create policy "Enable insert for authenticated users only"
on "public"."claims"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow owners of registries to delete them based on address"
on "public"."registries"
as permissive
for delete
to public
using (((auth.jwt() ->> 'address'::text) = admin_id));


create policy "Allow owners of registries to update based on address"
on "public"."registries"
as permissive
for update
to public
using (((auth.jwt() ->> 'address'::text) = admin_id))
with check (((auth.jwt() ->> 'address'::text) = admin_id));


create policy "Enable insert for authenticated users only"
on "public"."registries"
as permissive
for insert
to authenticated
with check (true);
