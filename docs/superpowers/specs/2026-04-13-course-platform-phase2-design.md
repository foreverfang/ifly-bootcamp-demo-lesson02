# Course Platform Phase 2 Design

**Date:** 2026-04-13

## Goal

Build the second phase of the course platform monorepo by adding the first real backend domain model and the first user-facing product flows:

- Supabase-backed identity and authorization foundations
- course, lesson, assignment, and submission data structures
- a minimal web application flow for sign-in, course browsing, and role-aware dashboards

This phase intentionally stops short of a full admin system. It creates a stable base that later phases can extend without reshaping core tables or authorization rules.

## Confirmed Inputs

- Repository structure remains monorepo-first.
- `apps/web` is the primary Next.js application.
- `apps/playground` remains a Vite-based component playground.
- Backend infrastructure lives under `supabase/`.
- Supabase scope for this project is `Auth + Database + Storage + RLS`.
- Shared packages remain split into `ui`, `config`, `utils`, `supabase`, and shared TypeScript config.
- The product domain is a course platform.
- The role set is fixed to `student / teacher / admin`.
- AI product features are out of scope for this phase.

## Scope

### In Scope

- Supabase SQL migration draft for the course platform core domain
- role and membership model
- initial RLS policy direction
- shared Supabase runtime helpers
- `apps/web` route skeletons for sign-in, course list, course detail, and dashboard
- placeholder data flow boundaries that match the final architecture

### Out of Scope

- full course management UI
- teacher authoring workflows
- submission review workflows
- realtime features
- vector search or AI chat
- billing, notifications, analytics, or audit logging

## Recommended Architecture

Use a split authorization model:

- global platform role in `user_roles`
- per-course relationship in `course_members`

This is the balanced design because it separates platform-wide authority from course-local participation. That keeps `admin` rules simple while allowing later phases to expand teacher and learner membership without inventing another permission layer.

### Why not the lighter model

Storing a single role directly on `profiles` looks simpler, but it collapses platform and course responsibilities into one field. That becomes brittle as soon as a user teaches one course and studies another.

### Why not the heavier model

Adding audit logs, review queues, and publishing workflows now would produce tables and policies that the current application does not yet use. That would slow down validation without improving the immediate product path.

## Domain Model

### Identity and Role Layer

#### `profiles`

Purpose:
- Stores business-facing user profile data linked to `auth.users`.

Fields:
- `id uuid primary key references auth.users(id)`
- `email text not null unique`
- `display_name text not null`
- `avatar_url text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `user_roles`

Purpose:
- Stores platform-level roles.
- Used mainly for `admin` and future global permissions.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references profiles(id) on delete cascade`
- `role text not null check (role in ('student', 'teacher', 'admin'))`
- `created_at timestamptz not null default now()`

Constraints:
- unique `(user_id, role)`

Interpretation:
- `admin` exists here as a platform role.
- `student` and `teacher` may also be stored here for coarse-grained capability checks, but course access control should still be derived from `course_members`.

### Course Layer

#### `courses`

Purpose:
- Stores the top-level course entity.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `slug text not null unique`
- `title text not null`
- `summary text not null`
- `description text not null`
- `cover_image_path text null`
- `status text not null check (status in ('draft', 'published', 'archived')) default 'draft'`
- `created_by uuid not null references profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `course_members`

Purpose:
- Maps users to courses with a course-scoped role.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `course_id uuid not null references courses(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `role text not null check (role in ('student', 'teacher'))`
- `created_at timestamptz not null default now()`

Constraints:
- unique `(course_id, user_id)`

Interpretation:
- A learner enrolled in a course is `student`.
- A course owner or instructor is `teacher`.
- `admin` does not need a row here to see the course if RLS includes a global admin bypass.

#### `lessons`

Purpose:
- Represents ordered content units within a course.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `course_id uuid not null references courses(id) on delete cascade`
- `title text not null`
- `summary text not null`
- `content_md text not null`
- `sort_order integer not null`
- `published boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- unique `(course_id, sort_order)`

### Assignment Layer

#### `assignments`

Purpose:
- Stores assignment definitions belonging to a course.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `course_id uuid not null references courses(id) on delete cascade`
- `lesson_id uuid null references lessons(id) on delete set null`
- `title text not null`
- `description text not null`
- `due_at timestamptz null`
- `allow_file_upload boolean not null default true`
- `created_by uuid not null references profiles(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

#### `submissions`

Purpose:
- Stores learner submissions for assignments.

Fields:
- `id uuid primary key default gen_random_uuid()`
- `assignment_id uuid not null references assignments(id) on delete cascade`
- `student_id uuid not null references profiles(id) on delete cascade`
- `content text not null`
- `attachment_path text null`
- `status text not null check (status in ('draft', 'submitted', 'reviewed')) default 'submitted'`
- `submitted_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Constraints:
- unique `(assignment_id, student_id)`

Interpretation:
- One student has one active submission per assignment in this phase.
- Resubmission updates the existing row rather than creating attempt history.

## Storage Design

Use one Supabase storage bucket:

- `assignment-files`

Path convention:

- `course/{course_id}/assignment/{assignment_id}/student/{student_id}/{filename}`

Why:
- The path encodes ownership and makes future storage policies easier to reason about.
- The first phase does not need a separate database table for every object because `submissions.attachment_path` is enough for application lookup.

## Authorization Model

### Global Role Rules

- `admin`
  - full read and write access across all product tables
- `teacher`
  - may create and manage content for courses they teach
- `student`
  - may read published content for courses they belong to and manage only their own submissions

### Course-Scoped Rules

- a user can read a course if:
  - they are `admin`, or
  - they are a `teacher` or `student` member of the course, or
  - the course is `published` and the product later chooses to allow discovery

For this phase, keep course visibility membership-based plus admin bypass to avoid accidental public exposure.

## RLS Direction

The policies should follow these principles:

- `profiles`
  - users can read and update their own profile
  - admins can read all profiles
- `user_roles`
  - users can read their own roles
  - admins can manage all roles
- `courses`
  - admins can manage all courses
  - teachers can manage courses they teach
  - students can read courses they are enrolled in
- `lessons`
  - admins and course teachers can manage lessons
  - students can read published lessons in enrolled courses
- `assignments`
  - admins and course teachers can manage assignments
  - students can read assignments in enrolled courses
- `submissions`
  - students can insert and update only their own submissions
  - teachers can read submissions for courses they teach
  - admins can manage all submissions

## Web Application Surface

### Routes

- `/`
  - marketing-lite landing page for the course platform
- `/sign-in`
  - sign-in and sign-up entry page
- `/courses`
  - authenticated course list page
- `/courses/[slug]`
  - authenticated course detail page with lesson and assignment summary
- `/dashboard`
  - role-aware dashboard shell that will later branch into learner and teacher/admin views

### Package Responsibilities

- `packages/supabase`
  - environment accessors
  - browser/server client creation
  - auth/session helper boundaries
- `packages/utils`
  - domain types shared across app and infrastructure-facing code
- `packages/ui`
  - app shell primitives and later shadcn-derived shared components

## Error Handling

- Missing Supabase environment variables should fail fast in server code.
- Unauthenticated users should be redirected to `/sign-in`.
- Unauthorized users should receive a clear “no access” state instead of a silent empty page.
- Course detail pages should distinguish between “not found” and “not enrolled”.

## Testing Direction

This phase should verify:

- shared config helpers validate required environment values
- domain mapping helpers behave correctly
- route-level rendering works for the skeleton pages
- the monorepo still passes `pnpm typecheck` and `pnpm build`

Database RLS behavior can start as SQL draft coverage in this phase; runtime integration tests can come in the next phase once Supabase local or remote credentials are wired.

## Risks and Mitigations

### Risk: Overloading global roles

Mitigation:
- Keep course-specific access in `course_members`.

### Risk: Prematurely building full admin workflows

Mitigation:
- Limit phase 2 to route skeletons and backend contracts, not full CRUD UI.

### Risk: Storage policies becoming disconnected from submission ownership

Mitigation:
- Encode course, assignment, and student identifiers directly in the storage path.

## Deliverables for This Phase

- SQL migration draft for core tables and policies
- shared Supabase helper package improvements
- route skeletons in `apps/web`
- updated documentation for architecture and developer intent

