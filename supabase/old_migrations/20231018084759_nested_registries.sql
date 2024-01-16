create table "public"."hyperboard_registries" (
    "created_at" timestamp with time zone default now(),
    "hyperboard_id" uuid not null,
    "registries_id" uuid not null
);


alter table "public"."hyperboard_registries" enable row level security;

create table "public"."hyperboards" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "name" text not null,
    "admin_id" text not null
);


alter table "public"."hyperboards" enable row level security;

CREATE UNIQUE INDEX hyperboard_registries_pkey ON public.hyperboard_registries USING btree (hyperboard_id, registries_id);

CREATE UNIQUE INDEX hyperboards_pkey ON public.hyperboards USING btree (id);

alter table "public"."hyperboard_registries" add constraint "hyperboard_registries_pkey" PRIMARY KEY using index "hyperboard_registries_pkey";

alter table "public"."hyperboards" add constraint "hyperboards_pkey" PRIMARY KEY using index "hyperboards_pkey";

alter table "public"."hyperboard_registries" add constraint "hyperboard_registries_hyperboard_id_fkey" FOREIGN KEY (hyperboard_id) REFERENCES hyperboards(id) not valid;

alter table "public"."hyperboard_registries" validate constraint "hyperboard_registries_hyperboard_id_fkey";

alter table "public"."hyperboard_registries" add constraint "hyperboard_registries_registries_id_fkey" FOREIGN KEY (registries_id) REFERENCES registries(id) not valid;

alter table "public"."hyperboard_registries" validate constraint "hyperboard_registries_registries_id_fkey";
