# Supabase SQL 第一步执行说明

这个文档用于指导你在 Supabase 控制台执行第一段 SQL，完成：

- 建表
- 初始化课程数据
- 初始化作业数据

---

## 操作步骤

1. 打开 Supabase 控制台
2. 左侧点击 `SQL Editor`
3. 点击 `New query`
4. 把下面整段 SQL 一次性粘贴进去
5. 点击 `Run`

---

## 需要执行的 SQL

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

## 执行完成后检查

1. 打开左侧 `Table Editor`
2. 确认是否已经出现以下 4 张表：
   - `courses`
   - `enrollments`
   - `assignments`
   - `submissions`

3. 点开 `courses`
   - 应该能看到 2 条初始化课程数据

4. 点开 `assignments`
   - 应该能看到 2 条初始化作业数据

---

## 成功标志

如果执行成功，通常会出现以下情况之一：

- 页面没有红色报错
- 结果区域显示 `Success`
- 或者提示类似 `Success. No rows returned`

---

## 如果执行失败

如果有报错，不要自己猜。

直接把报错原文复制给我，我会继续帮你排查。

---

## 执行完后回复我

执行完后你回复我一句：

`第一段 SQL 已执行完成`

如果没成功，就把错误信息发我。
