-- profiles: thêm 2 cột mới
alter table profiles
  add column if not exists avatar_url text,
  add column if not exists use_avatar_mood boolean not null default true;

-- user_mood_images: bảng lưu 5 sticker per user
create table if not exists user_mood_images (
  user_id    uuid not null references auth.users(id) on delete cascade,
  mood       text not null check (mood in ('sad','neutral','happy','very_happy','tired')),
  image_url  text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, mood)
);

alter table user_mood_images enable row level security;

drop policy if exists "own rows only" on user_mood_images;
create policy "own rows only" on user_mood_images
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage buckets
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('mood-images', 'mood-images', false)
  on conflict (id) do nothing;

-- Storage RLS: avatars
drop policy if exists "avatars owner upload" on storage.objects;
create policy "avatars owner upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner read" on storage.objects;
create policy "avatars owner read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars owner update" on storage.objects;
create policy "avatars owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage RLS: mood-images
drop policy if exists "mood-images owner upload" on storage.objects;
create policy "mood-images owner upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'mood-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "mood-images owner read" on storage.objects;
create policy "mood-images owner read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'mood-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "mood-images owner update" on storage.objects;
create policy "mood-images owner update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'mood-images'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
