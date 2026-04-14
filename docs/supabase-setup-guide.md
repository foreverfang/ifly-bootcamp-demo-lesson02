# Supabase 动态 Demo 建库与接入步骤

这个文档用于指导你从零创建 Supabase 项目，并为当前 monorepo 动态 demo 准备后端数据库。

目标场景：

- 课程列表
- 课程报名
- 作业提交
- 提交记录展示

---

## 1. 创建 Supabase 项目

1. 打开 `https://supabase.com/`
2. 登录账号
3. 点击 `New project`
4. 选择你的组织
5. 填写项目信息：
   - `Project name`：`ifly-bootcamp-demo`
   - `Database Password`：自行设置并保存
   - `Region`：选择离你最近的区域
6. 点击创建
7. 等待项目初始化完成

---

## 2. 获取项目接入信息

项目创建完成后：

1. 打开左侧 `Project Settings`
2. 进入 `API`
3. 找到并保存以下两个值：
   - `Project URL`
   - `anon public key`

后面需要把这两个值提供给项目本地环境变量。

---

## 3. 执行建表 SQL

操作路径：

1. 打开左侧 `SQL Editor`
2. 点击 `New query`
3. 粘贴下面整段 SQL
4. 点击 `Run`

```sql
create extension if not exists "pgcrypto";

drop table if exists public.submissions cascade;
drop table if exists public.assignments cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.courses cascade;

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  teacher_name text not null,
  created_at timestamptz not null default now()
);

create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  created_at timestamptz not null default now(),
  unique (course_id, student_email)
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  content text not null,
  created_at timestamptz not null default now()
);

insert into public.courses (title, description, teacher_name)
values
  ('AI 前端工程实践', '学习 monorepo、Next.js、Supabase 的项目实战。', 'Fang'),
  ('全栈应用快速搭建', '学习前后端联动、数据建模与部署。', 'Fang');

insert into public.assignments (course_id, title, description)
select id, '课程作业一', '提交你对本课程的理解与一个简单实现说明。'
from public.courses
where title = 'AI 前端工程实践';

insert into public.assignments (course_id, title, description)
select id, '课程作业二', '提交一个前后端联动 demo 的设计说明。'
from public.courses
where title = '全栈应用快速搭建';
```

---

## 4. 执行权限 SQL

继续在 `SQL Editor` 中新建一个查询，粘贴下面 SQL 并执行。

```sql
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.assignments enable row level security;
alter table public.submissions enable row level security;

create policy "public read courses"
on public.courses
for select
to anon, authenticated
using (true);

create policy "public read assignments"
on public.assignments
for select
to anon, authenticated
using (true);

create policy "public insert enrollments"
on public.enrollments
for insert
to anon, authenticated
with check (true);

create policy "public read enrollments"
on public.enrollments
for select
to anon, authenticated
using (true);

create policy "public insert submissions"
on public.submissions
for insert
to anon, authenticated
with check (true);

create policy "public read submissions"
on public.submissions
for select
to anon, authenticated
using (true);
```

说明：

- 这是为了课程 demo 简化后的权限策略
- 适合演示真实前后端读写
- 不适合直接作为生产环境权限方案

---

## 5. 检查建库是否成功

操作路径：

1. 打开左侧 `Table Editor`
2. 确认存在以下 4 张表：
   - `courses`
   - `enrollments`
   - `assignments`
   - `submissions`
3. 打开 `courses`
4. 确认已经有初始化课程数据
5. 打开 `assignments`
6. 确认已经有初始化作业数据

---

## 6. 本地项目环境变量配置

在项目根目录创建 `.env.local` 文件，内容如下：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
```

示例：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx
```

---

## 7. 完成后需要发给我

完成以上步骤后，把以下两个值发给我：

1. `Project URL`
2. `anon public key`

我拿到后会继续为你实现：

- Next.js 接真实 Supabase
- 动态课程列表
- 报名写入数据库
- 作业提交写入数据库
- 前端展示报名与提交结果

---

## 8. 当前推荐实现范围

为了先把真实全栈动态链路跑通，推荐第一阶段只实现：

- 浏览课程
- 提交报名
- 选择作业并提交内容
- 查看自己的提交记录

先不接复杂登录、角色管理和严格 RLS，这样实现成本更低，也更适合作业展示。
