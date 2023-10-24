alter table "public"."claims" add column "admin_id" text not null;

create policy "Delete claims when you are the owner"
on "public"."claims"
as permissive
for delete
to public
using (((auth.jwt() ->> 'address'::text) = admin_id));
