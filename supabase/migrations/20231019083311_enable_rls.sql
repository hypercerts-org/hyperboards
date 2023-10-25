alter table "public"."hyperboard_claims" enable row level security;

alter table "public"."hyperboard_sponsor_metadata" enable row level security;

alter table "public"."registries" enable row level security;

create policy "Enable read access for all users"
on "public"."hyperboard_claims"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."hyperboard_registries"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."hyperboard_sponsor_metadata"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."registries"
as permissive
for select
to public
using (true);
