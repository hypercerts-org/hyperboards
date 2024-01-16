create policy "Only allow for owner of hyperboard"
on "public"."hyperboard_registries"
as permissive
for delete
to public
using (((auth.jwt() ->> 'address'::text) IN ( SELECT hyperboards.admin_id
   FROM hyperboards
  WHERE (hyperboard_registries.hyperboard_id = hyperboards.id))));


create policy "Enable delete for users based on address"
on "public"."hyperboards"
as permissive
for delete
to public
using (((auth.jwt() ->> 'address'::text) = admin_id));
