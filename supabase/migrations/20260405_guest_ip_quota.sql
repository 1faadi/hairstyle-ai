create table if not exists public.guest_ip_usage (
  ip_hash text primary key,
  used_success_count integer not null default 0 check (used_success_count >= 0),
  blocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generation_jobs (
  task_id text primary key,
  provider text not null check (provider in ('ailab', 'vmodel')),
  status text not null check (status in ('starting', 'processing', 'succeeded', 'failed', 'canceled')),
  user_id uuid references auth.users(id) on delete set null,
  ip_hash text references public.guest_ip_usage(ip_hash) on delete set null,
  credit_consumed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generation_jobs_ip_hash_pending_idx
  on public.generation_jobs (ip_hash, status)
  where status in ('starting', 'processing');

create index if not exists generation_jobs_user_id_idx
  on public.generation_jobs (user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guest_ip_usage_set_updated_at on public.guest_ip_usage;
create trigger guest_ip_usage_set_updated_at
before update on public.guest_ip_usage
for each row execute function public.set_updated_at();

drop trigger if exists generation_jobs_set_updated_at on public.generation_jobs;
create trigger generation_jobs_set_updated_at
before update on public.generation_jobs
for each row execute function public.set_updated_at();

create or replace function public.consume_guest_credit_on_success(
  p_task_id text,
  p_ip_hash text
)
returns table (
  used_success_count integer,
  remaining integer,
  consumed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_credit_consumed boolean;
  v_used_count integer;
  v_limit integer := 3;
begin
  if p_ip_hash is null or length(trim(p_ip_hash)) = 0 then
    raise exception 'p_ip_hash is required';
  end if;

  insert into public.guest_ip_usage (ip_hash)
  values (p_ip_hash)
  on conflict (ip_hash) do nothing;

  select credit_consumed
    into v_credit_consumed
  from public.generation_jobs
  where task_id = p_task_id
  for update;

  if not found then
    raise exception 'generation_jobs row not found for task_id: %', p_task_id;
  end if;

  if v_credit_consumed then
    select g.used_success_count
      into v_used_count
    from public.guest_ip_usage g
    where g.ip_hash = p_ip_hash;

    return query
    select v_used_count, greatest(0, v_limit - v_used_count), false;
    return;
  end if;

  update public.generation_jobs
  set credit_consumed = true
  where task_id = p_task_id
    and credit_consumed = false;

  if found then
    update public.guest_ip_usage
    set used_success_count = used_success_count + 1
    where ip_hash = p_ip_hash
    returning guest_ip_usage.used_success_count into v_used_count;

    return query
    select v_used_count, greatest(0, v_limit - v_used_count), true;
    return;
  end if;

  select g.used_success_count
    into v_used_count
  from public.guest_ip_usage g
  where g.ip_hash = p_ip_hash;

  return query
  select v_used_count, greatest(0, v_limit - v_used_count), false;
end;
$$;

alter table public.guest_ip_usage enable row level security;
alter table public.generation_jobs enable row level security;
