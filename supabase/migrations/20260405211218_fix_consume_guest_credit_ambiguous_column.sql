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
    update public.guest_ip_usage as g
    set used_success_count = g.used_success_count + 1
    where g.ip_hash = p_ip_hash
    returning g.used_success_count into v_used_count;

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
