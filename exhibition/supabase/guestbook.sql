-- 김선례 개인전 방명록 (Supabase SQL Editor에서 한 번 실행)

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 20),
  message text not null check (char_length(message) between 1 and 200),
  flower text not null check (flower in ('peony','sunflower','cherry','hydrangea','magnolia')),
  hidden boolean not null default false,
  client_hash text
);

create index if not exists guestbook_created_at_idx on public.guestbook (created_at desc);
create index if not exists guestbook_client_idx on public.guestbook (client_hash, created_at desc);

alter table public.guestbook enable row level security;

-- 읽기: 숨기지 않은 글만. client_hash 열은 공개하지 않는다
drop policy if exists "read visible" on public.guestbook;
create policy "read visible" on public.guestbook for select to anon, authenticated using (hidden = false);
revoke all on public.guestbook from anon, authenticated;
grant select (id, created_at, name, message, flower) on public.guestbook to anon, authenticated;

-- 쓰기: 테이블 직접 insert는 막고, 아래 함수로만 받는다 (30초 제한, 1분 전체 30건 제한)
create or replace function public.add_guestbook_entry(
  p_name text, p_message text, p_flower text, p_client text
) returns table (id uuid, created_at timestamptz, name text, message text, flower text)
language plpgsql
security definer
set search_path = public
as $$
declare
  n text := btrim(coalesce(p_name, ''));
  m text := btrim(coalesce(p_message, ''));
begin
  if char_length(n) not between 1 and 20
     or char_length(m) not between 1 and 200
     or p_flower not in ('peony','sunflower','cherry','hydrangea','magnolia') then
    raise exception 'invalid';
  end if;
  if p_client is not null and exists (
    select 1 from guestbook g where g.client_hash = p_client and g.created_at > now() - interval '30 seconds'
  ) then
    raise exception 'rate_limited';
  end if;
  if (select count(*) from guestbook g where g.created_at > now() - interval '1 minute') >= 30 then
    raise exception 'busy';
  end if;
  return query
    insert into guestbook as g (name, message, flower, client_hash)
    values (n, m, p_flower, p_client)
    returning g.id, g.created_at, g.name, g.message, g.flower;
end;
$$;

revoke all on function public.add_guestbook_entry(text, text, text, text) from public;
grant execute on function public.add_guestbook_entry(text, text, text, text) to anon;

-- 글 숨기기 (대시보드 SQL Editor에서):
--   update public.guestbook set hidden = true where name = '...' and message like '...%';
