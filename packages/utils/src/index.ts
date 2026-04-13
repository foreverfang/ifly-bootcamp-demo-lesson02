export type AppShellCard = {
  title: string
  description: string
}

export const appShellCards: AppShellCard[] = [
  {
    title: '前台学习端',
    description: '课程目录、章节详情、作业提交、学习进度会在这里落地。',
  },
  {
    title: '后台管理能力',
    description: '课程管理、作业审核、角色授权与资源配置会逐步补齐。',
  },
  {
    title: 'Supabase 后端能力',
    description:
      '认证、存储、RLS 与未来的业务表结构都会在 backend infra 中实现。',
  },
]

export * from './course-platform'
