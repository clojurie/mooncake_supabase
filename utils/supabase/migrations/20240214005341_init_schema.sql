-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create gift box applications table
create table public.gift_box_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id),
  email text not null,
  box_type text not null check (box_type in ('regular', 'halal')),
  delivery_method text not null check (delivery_method in ('pickup', 'delivery')),
  delivery_address text,
  delivery_recipient text,
  delivery_phone text,
  tracking_number text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'shipped', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.gift_box_applications is '中秋节礼盒申请记录';

-- Enable RLS
alter table public.gift_box_applications enable row level security;

-- Create policies
create policy "Users can view their own applications"
on public.gift_box_applications for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own applications"
on public.gift_box_applications for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admin can view all applications"
on public.gift_box_applications for select
to authenticated
using (
  auth.jwt() ->> 'email' = 'admin@example.com'
);

create policy "Admin can update all applications"
on public.gift_box_applications for update
to authenticated
using (auth.jwt() ->> 'email' = 'admin@example.com')
with check (auth.jwt() ->> 'email' = 'admin@example.com');

-- Create function to prevent duplicate applications
create or replace function public.check_duplicate_application()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Set email from auth.users table
  new.email := (select email from auth.users where id = new.user_id);
  if exists (
    select 1
    from public.gift_box_applications
    where user_id = new.user_id
  ) then
    raise exception 'User has already applied for a gift box';
  end if;
  return new;
end;
$$;

-- Create trigger for duplicate check
create trigger check_duplicate_application_trigger
before insert on public.gift_box_applications
for each row
execute function public.check_duplicate_application();

-- Initialize test users
-- Note: Passwords are same as emails for testing purpose
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', '8d0fd2b3-9ca7-4d9e-a95f-9e13dded323e', 'authenticated', 'authenticated', 'admin@example.com', crypt('admin@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'e5a5f3a9-4c6b-4a3d-a21b-673509aa53ae', 'authenticated', 'authenticated', 'e0001@example.com', crypt('e0001@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'f7b0c3d2-1e4a-4b5c-9d8e-2f1a3b4c5d6e', 'authenticated', 'authenticated', 'e0002@example.com', crypt('e0002@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a1b2c3d4-5e6f-4a8b-910a-1b2c3d4e5f6a', 'authenticated', 'authenticated', 'e0003@example.com', crypt('e0003@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'f908d7c6-b5a4-432e-b1a0-f9e8d7c6b5a4', 'authenticated', 'authenticated', 'e0004@example.com', crypt('e0004@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a1a2e3c4-d5b6-47a8-a9b0-a1a2d3f4a5b6', 'authenticated', 'authenticated', 'e0005@example.com', crypt('e0005@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'c9a8b7c6-b5a4-43b2-a1a0-b9a8f7d6a5a4', 'authenticated', 'authenticated', 'e0006@example.com', crypt('e0006@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'c1d2e3f4-a5b6-47a8-a9d0-f1a2b3a4b5c6', 'authenticated', 'authenticated', 'e0007@example.com', crypt('e0007@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a1d2b3c4-e5f6-47b8-a9a0-b1a2f3d4a5a6', 'authenticated', 'authenticated', 'e0008@example.com', crypt('e0008@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'a1e2c3d4-b5f6-47a8-a9a0-a1d2f3a4b5f6', 'authenticated', 'authenticated', 'e0009@example.com', crypt('e0009@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', 'b1c2d3e4-a5f6-47b8-a9a0-a1e2c3d4b5f6', 'authenticated', 'authenticated', 'e0010@example.com', crypt('e0010@example.com', gen_salt('bf')), now(), now(), now(), '', '', '', '');
