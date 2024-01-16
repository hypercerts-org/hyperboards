create table "public"."users" (
    "id" uuid,
    "created_at" timestamp with time zone not null default now(),
    "auth" json not null,
    "email" text,
    "address" text not null
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (address);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

create policy "Enable insert for authenticated users only"
on "public"."hyperboards"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."hyperboards"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on address"
on "public"."hyperboards"
as permissive
for update
to public
using (((auth.jwt() ->> 'address'::text) = admin_id))
with check (((auth.jwt() ->> 'address'::text) = admin_id));
