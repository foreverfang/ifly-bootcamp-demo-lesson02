# Course Platform Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first real course-platform domain layer by introducing Supabase-backed course, lesson, assignment, submission, and authorization foundations, then connect `apps/web` to those contracts with initial authenticated routes.

**Architecture:** Keep the balanced authorization split from the approved spec: global roles live in `user_roles`, while course-scoped relationships live in `course_members`. Implement backend contracts first in `supabase/` and `packages/supabase`, then add typed domain models in `packages/utils`, then connect the Next.js web surface with thin route-level skeletons that rely on shared packages rather than embedding infrastructure logic directly in page files.

**Tech Stack:** pnpm workspace, Turborepo, Next.js App Router, React 19, Supabase, TypeScript strict mode, Biome

---

## File Structure

### Existing files to modify

- Modify: `package.json`
- Modify: `README.md`
- Modify: `apps/web/app/page.tsx`
- Modify: `apps/web/app/layout.tsx`
- Modify: `packages/config/src/index.ts`
- Modify: `packages/supabase/src/index.ts`
- Modify: `packages/utils/src/index.ts`

### Files to create

- Create: `supabase/migrations/202604130001_course_platform_phase2.sql`
- Create: `packages/supabase/src/env.ts`
- Create: `packages/supabase/src/types.ts`
- Create: `packages/supabase/src/server.ts`
- Create: `packages/supabase/src/browser.ts`
- Create: `packages/supabase/src/auth.ts`
- Create: `packages/utils/src/course-platform.ts`
- Create: `packages/utils/src/course-platform.test.ts`
- Create: `apps/web/middleware.ts`
- Create: `apps/web/app/sign-in/page.tsx`
- Create: `apps/web/app/courses/page.tsx`
- Create: `apps/web/app/courses/[slug]/page.tsx`
- Create: `apps/web/app/dashboard/page.tsx`
- Create: `apps/web/app/(marketing)/layout.tsx`
- Create: `apps/web/app/(marketing)/page.tsx`
- Create: `apps/web/lib/session.ts`
- Create: `apps/web/lib/mock-data.ts`
- Create: `apps/web/lib/guards.ts`
- Create: `apps/web/app/error.tsx`
- Create: `apps/web/app/not-found.tsx`

### Test and verification targets

- Test: `packages/utils/src/course-platform.test.ts`
- Verify: `pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts`
- Verify: `pnpm typecheck`
- Verify: `pnpm build`

---

### Task 1: Add Workspace Test Tooling For Shared Package Development

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Write the failing test script expectation**

The repository does not currently have a package-level unit test runner for shared TypeScript helpers. Add root test tooling so later tasks can follow TDD instead of writing implementation code first.

- [ ] **Step 2: Run a command to confirm the test tool is missing**

Run: `pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts`  
Expected: FAIL with a command-not-found or missing-package error for `vitest`.

- [ ] **Step 3: Add minimal root test tooling**

Update `package.json` to include:

```json
{
  "scripts": {
    "test": "turbo test",
    "test:utils": "pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts"
  },
  "devDependencies": {
    "vitest": "^3.1.2"
  }
}
```

- [ ] **Step 4: Run the missing test command again**

Run: `pnpm install && pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts`  
Expected: FAIL because `src/course-platform.test.ts` does not exist yet, proving the test runner is now installed.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add workspace test tooling"
```

---

### Task 2: Define And Test Course Platform Shared Domain Contracts

**Files:**
- Create: `packages/utils/src/course-platform.ts`
- Create: `packages/utils/src/course-platform.test.ts`
- Modify: `packages/utils/src/index.ts`

- [ ] **Step 1: Write the failing test**

Create `packages/utils/src/course-platform.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import {
  canManageCourse,
  canViewCourse,
  getDashboardLabel,
  type CourseMembershipRole,
  type PlatformRole,
} from './course-platform'

describe('course-platform domain helpers', () => {
  it('allows admins to manage any course', () => {
    const roles: PlatformRole[] = ['admin']

    expect(canManageCourse(roles, 'student')).toBe(true)
    expect(canManageCourse(roles, 'teacher')).toBe(true)
  })

  it('allows teachers to manage only courses they teach', () => {
    const roles: PlatformRole[] = ['teacher']

    expect(canManageCourse(roles, 'teacher')).toBe(true)
    expect(canManageCourse(roles, 'student')).toBe(false)
  })

  it('allows students to view but not manage enrolled courses', () => {
    const roles: PlatformRole[] = ['student']
    const membership: CourseMembershipRole = 'student'

    expect(canViewCourse(roles, membership)).toBe(true)
    expect(canManageCourse(roles, membership)).toBe(false)
  })

  it('derives a stable dashboard label from roles', () => {
    expect(getDashboardLabel(['admin'])).toBe('平台管理台')
    expect(getDashboardLabel(['teacher'])).toBe('教师工作台')
    expect(getDashboardLabel(['student'])).toBe('学习中心')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts`  
Expected: FAIL with `Cannot find module './course-platform'`.

- [ ] **Step 3: Write minimal implementation**

Create `packages/utils/src/course-platform.ts`:

```ts
export type PlatformRole = 'student' | 'teacher' | 'admin'

export type CourseMembershipRole = 'student' | 'teacher'

export function canManageCourse(
  platformRoles: PlatformRole[],
  membershipRole: CourseMembershipRole,
) {
  return platformRoles.includes('admin') || membershipRole === 'teacher'
}

export function canViewCourse(
  platformRoles: PlatformRole[],
  membershipRole: CourseMembershipRole,
) {
  return platformRoles.includes('admin') || membershipRole === 'student' || membershipRole === 'teacher'
}

export function getDashboardLabel(platformRoles: PlatformRole[]) {
  if (platformRoles.includes('admin')) {
    return '平台管理台'
  }

  if (platformRoles.includes('teacher')) {
    return '教师工作台'
  }

  return '学习中心'
}
```

Update `packages/utils/src/index.ts`:

```ts
export * from './course-platform'
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @repo/utils exec vitest run src/course-platform.test.ts`  
Expected: PASS with 4 passing tests.

- [ ] **Step 5: Commit**

```bash
git add packages/utils/src/course-platform.ts packages/utils/src/course-platform.test.ts packages/utils/src/index.ts
git commit -m "feat: add course platform domain helpers"
```

---

### Task 3: Draft Supabase Schema And RLS Skeleton

**Files:**
- Create: `supabase/migrations/202604130001_course_platform_phase2.sql`

- [ ] **Step 1: Write the failing schema expectation**

Create a short checklist in your working notes before editing:

```text
Need tables: profiles, user_roles, courses, course_members, lessons, assignments, submissions
Need bucket reference strategy: assignment-files
Need RLS enabled on all business tables
Need admin bypass and course-scoped membership checks
```

This step is the schema equivalent of a failing test: the repository currently lacks the required migration.

- [ ] **Step 2: Confirm the migration does not exist**

Run: `Get-ChildItem supabase\\migrations`  
Expected: no file named `202604130001_course_platform_phase2.sql`.

- [ ] **Step 3: Write the minimal migration draft**

Create `supabase/migrations/202604130001_course_platform_phase2.sql` with:

```sql
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
  unique (course_id, sort_order)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete set null,
  title text not null,
  description text not null,
  due_at timestamptz,
  allow_file_upload boolean not null default true,
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = check_user_id and role = 'admin'
  );
$$;

create policy "profiles_self_or_admin_select"
on public.profiles
for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_self_update"
on public.profiles
for update
using (auth.uid() = id or public.is_admin(auth.uid()))
with check (auth.uid() = id or public.is_admin(auth.uid()));
```

Append comments for the remaining `courses`, `lessons`, `assignments`, `submissions`, and storage policies that state the intended teacher/student/admin access rules if full policy SQL is not yet implemented in this pass.

- [ ] **Step 4: Run a verification read**

Run: `Get-Content -Raw supabase\\migrations\\202604130001_course_platform_phase2.sql`  
Expected: file exists and includes all 7 tables plus `enable row level security`.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/202604130001_course_platform_phase2.sql
git commit -m "feat: draft course platform schema"
```

---

### Task 4: Add Shared Supabase Runtime Boundaries

**Files:**
- Create: `packages/supabase/src/env.ts`
- Create: `packages/supabase/src/types.ts`
- Create: `packages/supabase/src/server.ts`
- Create: `packages/supabase/src/browser.ts`
- Create: `packages/supabase/src/auth.ts`
- Modify: `packages/supabase/src/index.ts`

- [ ] **Step 1: Write the failing test expectation**

The current package exposes only `createSupabaseRuntimeConfig`, which is not enough for route-level auth and environment enforcement. Record the expected API surface:

```text
Expected exports:
- getSupabaseEnv()
- createServerSupabaseClient()
- createBrowserSupabaseClient()
- isAuthenticated()
```

- [ ] **Step 2: Confirm the current package does not expose the needed helpers**

Run: `Get-Content -Raw packages\\supabase\\src\\index.ts`  
Expected: only the runtime config helper exists.

- [ ] **Step 3: Write minimal implementation**

Create `packages/supabase/src/types.ts`:

```ts
export type SupabaseEnv = {
  url: string
  anonKey: string
}

export type SessionUser = {
  id: string
  email: string
}
```

Create `packages/supabase/src/env.ts`:

```ts
import type { SupabaseEnv } from './types'

export function getSupabaseEnv(env = process.env): SupabaseEnv {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are missing')
  }

  return { url, anonKey }
}
```

Create `packages/supabase/src/server.ts`:

```ts
import { getSupabaseEnv } from './env'

export function createServerSupabaseClient() {
  return {
    source: 'server',
    env: getSupabaseEnv(),
  }
}
```

Create `packages/supabase/src/browser.ts`:

```ts
import { getSupabaseEnv } from './env'

export function createBrowserSupabaseClient() {
  return {
    source: 'browser',
    env: getSupabaseEnv(),
  }
}
```

Create `packages/supabase/src/auth.ts`:

```ts
import type { SessionUser } from './types'

export function isAuthenticated(user: SessionUser | null | undefined) {
  return Boolean(user?.id)
}
```

Update `packages/supabase/src/index.ts`:

```ts
export * from './auth'
export * from './browser'
export * from './env'
export * from './server'
export * from './types'
```

- [ ] **Step 4: Run type verification**

Run: `pnpm --filter @repo/supabase typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/supabase/src
git commit -m "feat: add shared supabase runtime helpers"
```

---

### Task 5: Add Web Session And Guard Utilities

**Files:**
- Create: `apps/web/lib/session.ts`
- Create: `apps/web/lib/mock-data.ts`
- Create: `apps/web/lib/guards.ts`
- Modify: `packages/config/src/index.ts`

- [ ] **Step 1: Write the failing test expectation**

Capture the target helper behavior in working notes:

```text
Need getMockSessionUser() for placeholder UI
Need getMockPlatformRoles() for role-aware dashboard shell
Need requireSignedInUser() to gate authenticated pages
```

- [ ] **Step 2: Confirm the utilities do not exist**

Run: `Get-ChildItem apps\\web\\lib`  
Expected: directory missing or empty.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/lib/session.ts`:

```ts
import type { SessionUser } from '@repo/supabase'

export function getMockSessionUser(): SessionUser {
  return {
    id: 'demo-user-id',
    email: 'student@iflytek.com',
  }
}
```

Create `apps/web/lib/mock-data.ts`:

```ts
import type { PlatformRole } from '@repo/utils'

export function getMockPlatformRoles(): PlatformRole[] {
  return ['student']
}

export function getMockCourses() {
  return [
    {
      slug: 'ai-native-frontend',
      title: 'AI-Native 前端工程实践',
      summary: '从技术栈选型到课程交付的完整实践路径',
      lessons: 6,
      assignments: 2,
    },
    {
      slug: 'supabase-course-platform',
      title: 'Supabase 驱动的课程平台',
      summary: '围绕 Auth、Storage 与 RLS 构建全栈产品底座',
      lessons: 4,
      assignments: 1,
    },
  ]
}
```

Create `apps/web/lib/guards.ts`:

```ts
import { redirect } from 'next/navigation'

import { isAuthenticated } from '@repo/supabase'

import { getMockSessionUser } from './session'

export function requireSignedInUser() {
  const user = getMockSessionUser()

  if (!isAuthenticated(user)) {
    redirect('/sign-in')
  }

  return user
}
```

Update `packages/config/src/index.ts` to add:

```ts
export function getAppTagline() {
  return '面向课程、作业与权限治理的 AI-Friendly 全栈平台'
}
```

- [ ] **Step 4: Run type verification**

Run: `pnpm --filter @repo/web typecheck`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/lib packages/config/src/index.ts
git commit -m "feat: add web session and guard utilities"
```

---

### Task 6: Add Marketing And Authentication Route Skeletons

**Files:**
- Create: `apps/web/app/(marketing)/layout.tsx`
- Create: `apps/web/app/(marketing)/page.tsx`
- Create: `apps/web/app/sign-in/page.tsx`
- Modify: `apps/web/app/layout.tsx`
- Modify: `apps/web/app/page.tsx`

- [ ] **Step 1: Write the failing route expectation**

Document the expected route behavior:

```text
/ should present the course platform value proposition
/sign-in should present a clear sign-in entry without real auth yet
```

- [ ] **Step 2: Confirm the current home page is still generic scaffold content**

Run: `Get-Content -Raw apps\\web\\app\\page.tsx`  
Expected: only stage-1 scaffold text and generic cards.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/app/(marketing)/layout.tsx`:

```tsx
import type { ReactNode } from 'react'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
```

Create `apps/web/app/(marketing)/page.tsx`:

```tsx
import Link from 'next/link'

import { getAppName, getAppTagline } from '@repo/config'

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-16">
      <section className="space-y-5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Course Platform
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-950">
          {getAppName()}
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-600">{getAppTagline()}</p>
      </section>

      <section className="flex gap-4">
        <Link
          href="/sign-in"
          className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white"
        >
          进入登录
        </Link>
        <Link
          href="/courses"
          className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700"
        >
          查看课程入口
        </Link>
      </section>
    </main>
  )
}
```

Create `apps/web/app/sign-in/page.tsx`:

```tsx
export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-16">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">Auth</p>
        <h1 className="text-3xl font-semibold text-slate-950">登录课程平台</h1>
        <p className="text-sm leading-6 text-slate-600">
          下一阶段会接入 Supabase Auth。当前页面先作为真实登录流的路由占位。
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <p className="text-sm text-slate-700">建议登录方式：邮箱验证码或 Magic Link。</p>
      </div>
    </main>
  )
}
```

Update `apps/web/app/page.tsx` to:

```tsx
export { default } from './(marketing)/page'
```

Keep `apps/web/app/layout.tsx` unchanged except for any metadata copy updates needed to match the new course platform positioning.

- [ ] **Step 4: Run route build verification**

Run: `pnpm --filter @repo/web build`  
Expected: PASS with `/` and `/sign-in` routes generated.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app packages/config/src/index.ts
git commit -m "feat: add marketing and auth route skeletons"
```

---

### Task 7: Add Authenticated Course And Dashboard Shell Routes

**Files:**
- Create: `apps/web/app/courses/page.tsx`
- Create: `apps/web/app/courses/[slug]/page.tsx`
- Create: `apps/web/app/dashboard/page.tsx`
- Create: `apps/web/app/error.tsx`
- Create: `apps/web/app/not-found.tsx`

- [ ] **Step 1: Write the failing route expectation**

Expected behavior:

```text
/courses should require a signed-in user and render mock course cards
/courses/[slug] should render a detail shell or not-found for unknown slug
/dashboard should show a role-aware label
```

- [ ] **Step 2: Confirm the routes do not exist**

Run: `Get-ChildItem apps\\web\\app\\courses -Recurse`  
Expected: path missing.

- [ ] **Step 3: Write minimal implementation**

Create `apps/web/app/courses/page.tsx`:

```tsx
import Link from 'next/link'

import { requireSignedInUser } from '@/lib/guards'
import { getMockCourses } from '@/lib/mock-data'

export default function CoursesPage() {
  const user = requireSignedInUser()
  const courses = getMockCourses()

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Courses</p>
        <h1 className="text-4xl font-semibold text-slate-950">课程中心</h1>
        <p className="text-sm text-slate-600">当前登录身份：{user.email}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-slate-950">{course.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{course.summary}</p>
            <p className="mt-4 text-sm text-slate-500">
              {course.lessons} 节课 · {course.assignments} 个作业
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}
```

Create `apps/web/app/courses/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'

import { requireSignedInUser } from '@/lib/guards'
import { getMockCourses } from '@/lib/mock-data'

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  requireSignedInUser()

  const { slug } = await params
  const course = getMockCourses().find((item) => item.slug === slug)

  if (!course) {
    notFound()
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Course Detail</p>
      <h1 className="text-4xl font-semibold text-slate-950">{course.title}</h1>
      <p className="max-w-3xl text-base leading-7 text-slate-600">{course.summary}</p>
      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">下一阶段接入内容</h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
          <li>课程章节列表</li>
          <li>作业定义与提交入口</li>
          <li>课程成员与权限校验</li>
        </ul>
      </section>
    </main>
  )
}
```

Create `apps/web/app/dashboard/page.tsx`:

```tsx
import { getDashboardLabel } from '@repo/utils'

import { requireSignedInUser } from '@/lib/guards'
import { getMockPlatformRoles } from '@/lib/mock-data'

export default function DashboardPage() {
  const user = requireSignedInUser()
  const roles = getMockPlatformRoles()

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-16">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
      <h1 className="text-4xl font-semibold text-slate-950">{getDashboardLabel(roles)}</h1>
      <p className="text-sm text-slate-600">当前用户：{user.email}</p>
    </main>
  )
}
```

Create `apps/web/app/error.tsx`:

```tsx
'use client'

export default function GlobalError() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-950">页面加载失败</h1>
      <p className="text-sm leading-6 text-slate-600">
        请刷新页面重试；如果问题持续存在，后续将接入更明确的错误追踪与告警。
      </p>
    </main>
  )
}
```

Create `apps/web/app/not-found.tsx`:

```tsx
import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold text-slate-950">页面不存在</h1>
      <p className="text-sm leading-6 text-slate-600">
        课程可能不存在，或者你当前没有访问权限。
      </p>
      <Link href="/courses" className="text-sm font-medium text-slate-950 underline underline-offset-4">
        返回课程中心
      </Link>
    </main>
  )
}
```

- [ ] **Step 4: Run verification**

Run: `pnpm --filter @repo/web typecheck && pnpm --filter @repo/web build`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/app apps/web/lib
git commit -m "feat: add course and dashboard route shells"
```

---

### Task 8: Final Documentation And Repository Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write the failing documentation expectation**

Expected README additions:

```text
Need a short monorepo map
Need phase 2 summary
Need verification commands
Need note about Supabase environment variables
```

- [ ] **Step 2: Confirm the current README is still phase-1 focused**

Run: `Get-Content -Raw README.md`  
Expected: no mention of phase-2 schema or authenticated routes.

- [ ] **Step 3: Write minimal documentation update**

Append to `README.md`:

```md
## Phase 2 Progress

- Added approved course-platform schema draft under `supabase/migrations`
- Added shared Supabase runtime helpers under `packages/supabase`
- Added course-platform domain helpers under `packages/utils`
- Added authenticated route shells in `apps/web`

## Required Environment Variables

`apps/web` and `packages/supabase` expect:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

For the current mock-driven route shell, these variables are only required once the real Supabase clients are wired into runtime code.

## Verification

```bash
pnpm test:utils
pnpm typecheck
pnpm build
```
```

- [ ] **Step 4: Run final verification**

Run:

```bash
pnpm test:utils
pnpm typecheck
pnpm build
```

Expected:
- `pnpm test:utils`: PASS
- `pnpm typecheck`: PASS
- `pnpm build`: PASS

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: update phase 2 progress and verification"
```

---

## Self-Review

### Spec coverage

- Approved balanced role model: covered by Tasks 2, 3, 4, 5, 7
- Supabase schema and RLS direction: covered by Task 3
- shared package responsibilities: covered by Tasks 2 and 4
- route skeletons for sign-in, courses, course detail, dashboard: covered by Tasks 6 and 7
- documentation and verification: covered by Task 8

No spec gaps found.

### Placeholder scan

- No `TODO`, `TBD`, or “similar to Task N” placeholders remain.
- Every task contains exact file paths and verification commands.

### Type consistency

- Shared role names are consistently `student`, `teacher`, `admin`.
- Course membership role remains `student | teacher`.
- Shared helper names are consistent across later tasks.

