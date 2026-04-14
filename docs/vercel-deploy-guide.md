# Vercel 部署说明

本文用于部署当前仓库中的动态全栈 demo。

当前仓库是一个 monorepo，其中：

- `apps/web` 是动态 `Next.js` 项目
- `apps/playground` 更适合静态展示
- `GitHub Actions` 负责代码检查
- `Vercel` 负责运行 `apps/web`

## 1. 部署前提

在开始前，请确保以下条件已经满足：

- 代码已经推送到 GitHub 仓库
- `Supabase` 项目已经创建完成
- `Supabase` SQL 已执行完成
- 本地访问 `apps/web` 时，`/courses` 页面已经可以正常读取和写入数据

## 2. 为什么不用 GitHub Pages 部署动态 demo

`GitHub Pages` 适合静态站点。

当前项目中的 `apps/web` 使用了：

- `Next.js`
- 动态服务端渲染
- Server Actions
- `Supabase` 动态读写

因此不适合直接部署到 `GitHub Pages`。

如果希望在线访问动态 demo，推荐使用 `Vercel`。

## 3. 在 Vercel 中导入项目

1. 打开 `https://vercel.com`
2. 使用 `GitHub` 账号登录
3. 点击 `Add New...`
4. 选择 `Project`
5. 选择仓库 `foreverfang/ifly-bootcamp-demo-lesson02`
6. 点击 `Import`

## 4. 关键配置

导入项目后，必须确认以下配置：

### Root Directory

将 `Root Directory` 设置为：

```txt
apps/web
```

这是当前项目最关键的配置项。

因为仓库是 monorepo，如果不把根目录设为 `apps/web`，Vercel 会尝试从仓库根目录构建，容易导致构建失败或识别错误。

### Framework Preset

一般会自动识别为：

```txt
Next.js
```

如果自动识别正确，保持默认即可。

### Build Command

通常保持默认即可，不需要手动修改。

### Output Directory

通常保持默认即可，不需要手动修改。

## 5. 环境变量

在 Vercel 项目中打开：

```txt
Settings -> Environment Variables
```

添加以下两个变量：

```env
NEXT_PUBLIC_SUPABASE_URL=https://oqhuzfeakftkwvvdfgkq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的 Supabase Publishable Key
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL`：你的 `Supabase Project URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`：当前 Supabase 控制台中的 `Publishable key`

## 6. 如何找到 Supabase 配置

### Project URL

进入 `Supabase` 控制台后可直接看到：

- `Project Settings`
- 或者项目首页中的连接信息

当前项目对应示例：

```txt
https://oqhuzfeakftkwvvdfgkq.supabase.co
```

### Publishable key

进入：

```txt
Project Settings -> API Keys
```

复制：

```txt
Publishable key
```

注意不要把 `Secret key` 填到前端公开环境变量里。

## 7. 开始部署

配置完成后，点击：

```txt
Deploy
```

首次部署完成后，Vercel 会给你一个访问地址，例如：

```txt
https://your-project-name.vercel.app
```

## 8. 部署完成后的验证

部署成功后，重点验证下面几个地址：

### 课程列表页

```txt
/courses
```

验证项：

- 页面能正常打开
- 能看到课程数据
- 页面样式正常

### 数据总览页

```txt
/dashboard
```

验证项：

- 能看到课程数、作业数、报名数、提交数

### 课程详情页

```txt
/courses/<course-id>
```

验证项：

- 能打开详情页
- 可以提交报名
- 可以提交作业
- 提交后页面可以看到新数据

## 9. 自动部署说明

完成仓库绑定后：

- 每次 push 到绑定分支
- Vercel 会自动重新构建和部署

通常不需要手动重复导入项目。

## 10. 推荐搭配方式

推荐使用以下组合：

- `GitHub Actions`：做 `lint / check / typecheck / test`
- `Vercel`：部署 `apps/web`
- `Supabase`：提供数据库和后端能力

这样职责最清晰，也最适合当前这个课程 demo。

## 11. 常见问题

### 1. 页面打开后提示 Supabase 相关错误

通常检查以下内容：

- 环境变量是否填写正确
- `NEXT_PUBLIC_SUPABASE_URL` 是否正确
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 是否正确
- `Supabase` 数据表和初始 SQL 是否已经执行

### 2. 部署成功但页面没有数据

通常检查：

- 当前访问的 Vercel 项目是否就是 `apps/web`
- Supabase 项目中是否已有课程演示数据
- SQL 初始化是否执行完成

### 3. monorepo 构建失败

优先检查：

- `Root Directory` 是否设置成 `apps/web`

这是最常见原因。

## 12. 当前项目部署建议

对当前仓库，建议按下面方式理解：

- `GitHub`：代码托管
- `GitHub Actions`：持续集成
- `Vercel`：动态前端部署
- `Supabase`：后端服务

如果后续还需要：

- 自定义域名
- 生产环境和预发环境分离
- 多环境变量管理

可以在当前基础上继续扩展。
