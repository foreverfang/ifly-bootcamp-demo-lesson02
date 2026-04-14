import Link from 'next/link'

import { getDashboardStats } from '@/lib/course-demo'
import {
  getErrorMessage,
  isSupabaseSetupPending,
} from '@/lib/course-demo-error'
import styles from '../demo-ui.module.css'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  try {
    const stats = await getDashboardStats()

    return (
      <main className={styles.page}>
        <section className={`${styles.hero} ${styles.heroLight}`}>
          <div className={styles.heroGrid}>
            <header>
              <p className={styles.eyebrow}>Live Backend Overview</p>
              <h1 className={styles.heroTitle}>{'课程平台运行总览'}</h1>
              <p className={styles.heroText}>
                {
                  '这里的统计数据直接来自 Supabase 中的课程、作业、报名和提交记录，可用来证明当前 demo 已经完成真实的前后端打通。'
                }
              </p>
            </header>
            <aside className={styles.heroAside}>
              <div className={styles.asideCard}>
                <p className={styles.asideTitle}>{'验证说明'}</p>
                <p className={styles.asideBody}>
                  {'报名和作业提交成功后，这里的数量会立即发生变化。'}
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'课程总数'}</p>
            <p className={styles.sectionTitle}>{stats.courseCount}</p>
            <p className={styles.sectionText}>
              {'当前已接入可展示的课程条目。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'作业数'}</p>
            <p className={styles.sectionTitle}>{stats.assignmentCount}</p>
            <p className={styles.sectionText}>
              {'支撑动态提交演示的作业配置数量。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'报名记录'}</p>
            <p className={styles.sectionTitle}>{stats.enrollmentCount}</p>
            <p className={styles.sectionText}>
              {'由课程详情页报名表单实时写入。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'作业提交'}</p>
            <p className={styles.sectionTitle}>{stats.submissionCount}</p>
            <p className={styles.sectionText}>
              {'提交成功后会立刻反映到这里。'}
            </p>
          </article>
        </section>

        <div>
          <Link href="/courses" className={styles.buttonPrimary}>
            {'返回课程列表'}
          </Link>
        </div>
      </main>
    )
  } catch (error) {
    return (
      <main className={styles.page}>
        <section className={styles.alert}>
          <p className={styles.sectionEyebrow}>Live Backend Overview</p>
          <h1 className={styles.alertTitle}>{'数据总览暂时不可用'}</h1>
          <p className={styles.sectionText}>
            {isSupabaseSetupPending(error)
              ? 'Supabase 项目已经连接成功，但演示所需的数据表还没有创建完成。'
              : getErrorMessage(error)}
          </p>
        </section>
      </main>
    )
  }
}
