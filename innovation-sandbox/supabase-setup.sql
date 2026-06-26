-- ============================================================
--  Innovation Sandbox — ตั้งค่าตัวนับสะสมบน Supabase
--  วิธีใช้: เปิด Supabase → SQL Editor → New query → วางทั้งหมดนี้ → Run
-- ============================================================

-- 1) ตารางเก็บค่าตัวนับ
create table if not exists public.counters (
  key   text primary key,
  count bigint not null default 0
);

-- 2) เตรียมแถวเริ่มต้น (ผู้เข้าชม + เอกสาร 4 รายการ)
insert into public.counters (key, count) values
  ('visits', 0),
  ('dl_proposal', 0),
  ('dl_budget', 0),
  ('dl_ppt', 0),
  ('dl_vpc', 0)
on conflict (key) do nothing;

-- 3) เปิด Row Level Security
alter table public.counters enable row level security;

-- 4) อนุญาตให้ทุกคน (anon) "อ่าน" ค่าตัวนับเพื่อแสดงผล
drop policy if exists "read counters" on public.counters;
create policy "read counters" on public.counters
  for select using (true);

-- 5) ฟังก์ชันเพิ่มค่าตัวนับแบบปลอดภัย (atomic + จำกัดเฉพาะ key ที่อนุญาต)
create or replace function public.increment_counter(counter_key text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare new_count bigint;
begin
  if counter_key not in ('visits','dl_proposal','dl_budget','dl_ppt','dl_vpc') then
    raise exception 'invalid counter key: %', counter_key;
  end if;

  insert into public.counters (key, count)
  values (counter_key, 1)
  on conflict (key) do update set count = public.counters.count + 1
  returning count into new_count;

  return new_count;
end;
$$;

-- 6) อนุญาตให้เว็บ (anon) เรียกใช้ฟังก์ชันเพิ่มค่าได้
grant execute on function public.increment_counter(text) to anon;

-- เสร็จแล้ว! กลับไปกรอก Project URL + anon key ใน js/config.js
