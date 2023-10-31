alter table "public"."claims" add column "owner_id" text not null;

create policy "Owners of blueprint or minters of blueprint can delete"
on "public"."blueprints"
as permissive
for delete
to public
using ((((auth.jwt() ->> 'address'::text) = admin_id) OR ((auth.jwt() ->> 'address'::text) = minter_address)));
