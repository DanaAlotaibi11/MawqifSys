-- Mawqifi+ website — security for the "Request a Service" form
-- Run once in Supabase → SQL Editor (by whoever owns the database).
-- Safe to re-run.

-- 1) The database sets status itself; the browser no longer sends it.
alter table public.service_requests
  alter column status set default 'NEW';

-- 2) Turn on Row Level Security.
alter table public.service_requests enable row level security;

-- 3) Visitors (anon key) may ONLY insert new requests.
--    No select/update/delete policy for anon = they can't read or change anything.
drop policy if exists "website can submit requests" on public.service_requests;

create policy "website can submit requests"
  on public.service_requests
  for insert
  to anon
  with check (
    status = 'NEW'
    and char_length(coalesce(name, ''))         between 1 and 120
    and char_length(coalesce(organization, '')) between 1 and 160
    and char_length(coalesce(email, ''))        between 3 and 200
    and char_length(coalesce(phone, ''))        <= 30
    and char_length(coalesce(message, ''))      between 1 and 4000
  );

-- 4) Check: this should list ONLY the insert policy above for role anon.
--    If you see any SELECT / UPDATE / DELETE policy for anon or public, drop it.
select policyname, cmd, roles
from pg_policies
where schemaname = 'public' and tablename = 'service_requests';
