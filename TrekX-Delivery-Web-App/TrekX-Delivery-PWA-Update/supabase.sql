create table public.deliveries (
 id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id),
 pickup text not null, destination text not null, sender text not null, phone text not null,
 recipient text not null, item text not null, status text default 'Pending', created_at timestamptz default now()
);
alter table public.deliveries enable row level security;
create policy "Users view own deliveries" on public.deliveries for select using (auth.uid()=user_id);
create policy "Users create own deliveries" on public.deliveries for insert with check (auth.uid()=user_id);