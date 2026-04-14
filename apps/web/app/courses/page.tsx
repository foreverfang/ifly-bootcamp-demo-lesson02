import Link from 'next/link'

import { getEnrollmentSummary } from '@repo/utils'

import { listCourseCatalog } from '@/lib/course-demo'
import {
  getErrorMessage,
  isSupabaseSetupPending,
} from '@/lib/course-demo-error'
import styles from '../demo-ui.module.css'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  try {
    const courses = await listCourseCatalog()

    return (
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <header>
              <p className={styles.eyebrow}>Live Supabase Demo</p>
              <h1 className={styles.heroTitle}>
                {'一个真实可写入的'}
                <span className={styles.heroTitleAccent}>
                  {'课程平台全栈演示'}
                </span>
              </h1>
              <p className={styles.heroText}>
                {
                  '当前页面直接从 Supabase 读取课程、作业与报名数据。进入课程后可以立即写入报名记录、提交作业，并看到 Next.js 页面基于真实后端数据实时回刷。'
                }
              </p>
              <div className={styles.chipRow}>
                <span className={styles.chip}>monorepo + Turborepo</span>
                <span className={styles.chip}>Next.js App Router</span>
                <span className={styles.chip}>{'Supabase 实时数据'}</span>
              </div>
            </header>

            <aside className={styles.heroAside}>
              <div className={styles.asideCard}>
                <p className={styles.asideTitle}>{'体验路径'}</p>
                <ol className={styles.numberList}>
                  <li>{'1. 选择一门课程进入详情页'}</li>
                  <li>{'2. 填写报名信息写入 Supabase'}</li>
                  <li>{'3. 提交作业并观察数据回流'}</li>
                </ol>
              </div>
              <div className={styles.asideCard}>
                <p className={styles.asideTitle}>{'当前目标'}</p>
                <p className={styles.asideBody}>
                  {
                    '用一个精简但完整的动态 demo，展示前端界面、服务端动作、数据库读写与 GitHub CI 的整条链路。'
                  }
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'数据状态'}</p>
            <p className={styles.sectionTitle}>{'已连接真实后端'}</p>
            <p className={styles.sectionText}>
              {'课程页、报名和作业提交流程都直接落到 Supabase。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'页面架构'}</p>
            <p className={styles.sectionTitle}>{'动静结合'}</p>
            <p className={styles.sectionText}>
              {'课程列表负责展示，详情页通过 Server Actions 执行写操作。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'UI 方向'}</p>
            <p className={styles.sectionTitle}>{'展示型首页'}</p>
            <p className={styles.sectionText}>
              {'采用深蓝冷白的视觉氛围，强调课程入口和全栈能力说明。'}
            </p>
          </article>
          <article className={styles.statCard}>
            <p className={styles.infoLabel}>{'仓库结构'}</p>
            <p className={styles.sectionTitle}>pnpm workspace</p>
            <p className={styles.sectionText}>
              {
                '共享 UI、工具库和 Supabase 封装，前后端能力按 monorepo 方式组织。'
              }
            </p>
          </article>
        </section>

        <section>
          <div className={styles.sectionHeader}>
            <header>
              <p className={styles.sectionEyebrow}>{'课程列表'}</p>
              <h2 className={styles.sectionTitle}>
                {'选择一门课程，开始完整的动态流程'}
              </h2>
            </header>
            <Link href="/dashboard" className={styles.buttonGhost}>
              {'查看数据总览'}
            </Link>
          </div>

          <section className={styles.courseGrid}>
            {courses.map((course, index) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className={styles.courseCard}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.pill} ${styles.pillSoft}`}>
                    {'课程 '}
                    {index + 1}
                  </span>
                  <span className={`${styles.pill} ${styles.pillDark}`}>
                    {'进入详情'}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{course.title}</h3>
                <p className={styles.cardText}>{course.description}</p>
                <div className={styles.infoGrid}>
                  <div>
                    <p className={styles.infoLabel}>{'讲师'}</p>
                    <p className={styles.infoValue}>{course.teacher_name}</p>
                  </div>
                  <div>
                    <p className={styles.infoLabel}>{'当前概况'}</p>
                    <p className={styles.infoValue}>
                      {getEnrollmentSummary(
                        course.assignmentCount,
                        course.enrollmentCount,
                      )}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </section>
      </main>
    )
  } catch (error) {
    const setupPending = isSupabaseSetupPending(error)

    return (
      <main className={styles.page}>
        <section className={styles.alert}>
          <p className={styles.sectionEyebrow}>Live Supabase Demo</p>
          <h1 className={styles.alertTitle}>{'后端初始化还未完成'}</h1>
          <p className={styles.sectionText}>
            {setupPending
              ? 'Next.js 页面已经接入你的真实 Supabase 项目，但当前还缺少演示所需的数据表与初始数据。'
              : getErrorMessage(error)}
          </p>
          <div className={styles.alertBox}>
            <p>
              <strong>{'下一步操作'}</strong>
            </p>
            <p>
              {
                '打开 Supabase SQL Editor，按顺序执行文档中的 SQL，再刷新当前页面。'
              }
            </p>
            <p>
              {'指引文档：'}
              <code>docs/supabase-setup-guide.md</code>
            </p>
          </div>
        </section>
      </main>
    )
  }
}
