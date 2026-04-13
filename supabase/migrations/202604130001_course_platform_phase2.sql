create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('student', 'teacher')),
  created_at timestamptz not null default now(),
  unique (course_id, user_id)
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  summary text not null,
  content_md text not null,
  sort_order integer not null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, course_id),
  unique (course_id, sort_order)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid,
  title text not null,
  description text not null,
  due_at timestamptz,
  allow_file_upload boolean not null default true,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assignments
add constraint assignments_lesson_course_fk
foreign key (lesson_id, course_id)
references public.lessons (id, course_id)
on delete no action;

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  content text not null,
  attachment_path text,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'reviewed')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id)
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.courses enable row level security;
alter table public.course_members enable row level security;
alter table public.lessons enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = check_user_id
      and role = 'admin'
  );
$$;

create policy "profiles_self_or_admin_select"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_self_or_admin_update"
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));

-- Remaining policy directions for later hardening:
-- user_roles: users should read their own roles; admins should manage all roles.
-- courses: admins should manage all courses; teachers should manage courses they teach;
--          students should read courses they are enrolled in.
-- lessons: admins and course teachers should manage lessons; students should read
--          published lessons in enrolled courses.
-- assignments: admins and course teachers should manage assignments; students should
--              read assignments in enrolled courses.
-- submissions: students should insert and update only their own submissions;
--               teachers should read submissions for courses they teach;
--               admins should manage all submissions.
-- storage: assignment-files bucket policies should follow the same course-scoped access
--          model and submission ownership rules as the database tables.
