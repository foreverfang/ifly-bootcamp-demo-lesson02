# Supabase SQL 第二步执行说明

这个文档用于指导你在 Supabase 控制台执行第二段 SQL，完成：

- 开启 RLS
- 添加演示用读写策略

这一步执行后，当前动态 demo 页面才能真正读取和写入 Supabase 数据。

---

## 操作步骤

1. 打开 Supabase 控制台
2. 进入你的项目
3. 左侧点击 `SQL Editor`
4. 点击 `New query`
5. 把下面整段 SQL 一次性粘贴进去
6. 点击 `Run`

---

## 需要执行的 SQL

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

---

## 执行完成后检查

执行成功后，建议你做两个简单检查：

1. 打开 `Table Editor`
2. 随便点开 `courses` 或 `assignments`
3. 确认表仍然存在，且没有报权限初始化错误

---

## 成功标志

如果执行成功，通常会出现以下情况之一：

- 页面没有红色报错
- 结果区域显示 `Success`
- 或者提示类似 `Success. No rows returned`

---

## 说明

这套策略是为了课程 demo 做的最小可用权限方案：

- 所有人都能读取课程和作业
- 所有人都能提交报名
- 所有人都能提交作业
- 所有人都能查看报名和提交记录

这适合演示真实前后端联动，但不适合直接用于正式生产环境。

---

## 如果执行失败

如果执行时报错，不要自己猜原因。

直接把报错原文复制给我，我会继续帮你排查。

---

## 执行完后回复我

执行完后你回复我一句：

`第二段 SQL 已执行完成`

如果没成功，就把错误信息发我。
