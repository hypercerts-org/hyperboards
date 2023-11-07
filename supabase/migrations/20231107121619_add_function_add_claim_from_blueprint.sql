create
or replace function add_claim_from_blueprint(
       registry_id uuid,
       hypercert_id text,
       chain_id int4,
       admin_id text,
       owner_id text,
       blueprint_id uuid,
       ) return uuid language plpgsql security definer set search_path = public
as $$
       declare
claim_id uuid;
     declare
old_blueprint_id uuid;
begin
select id
into old_blueprint_id
from blueprints
where (lower((auth.jwt() ->> 'address'::text)) = lower((minter_address)::text))
  and blueprint_id = blueprint_id;

if
old_blueprint_id is null then
   raise exception 'Blueprint not found';
end if;

insert into claims (registry_id, hypercert_id, chain_id, admin_id, owner_id)
values (registry_id, hypercert_id, chain_id, admin_id, owner_id) returning id
into claim_id;

delete
from blueprints
where id = old_blueprint_id;
return claim_id;
end;
$$;