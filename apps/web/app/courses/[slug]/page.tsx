import { notFound } from 'next/navigation'

import { createSubmissionSnippet } from '@repo/utils'

import styles from '@/app/demo-ui.module.css'
import { getCourseDetail } from '@/lib/course-demo'
import { enrollInCourse, submitAssignment } from '../actions'

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    error?: string
    notice?: string
  }>
}

export const dynamic = 'force-dynamic'

export default async function CourseDetailPage({
  params,
  searchParams,
}: CourseDetailPageProps) {
  const { slug: courseId } = await params
  const detail = await getCourseDetail(courseId)
  const feedback = await searchParams

  if (!detail) {
    notFound()
  }

  const { assignments, course, enrollments, submissions } = detail

  return (
    <main className={styles.page}>
      <section className={`${styles.hero} ${styles.heroLight}`}>
        <div className={styles.heroGrid}>
          <header>
            <p className={styles.eyebrow}>Course Detail</p>
            <h1 className={styles.heroTitle}>{course.title}</h1>
            <p className={styles.heroText}>{course.description}</p>
          </header>

          <div className={styles.metaGrid}>
            <div className={styles.metaCard}>
              <p className={styles.infoLabel}>{'讲师'}</p>
              <p className={styles.infoValue}>{course.teacher_name}</p>
            </div>
            <div className={styles.metaCard}>
              <p className={styles.infoLabel}>{'作业数'}</p>
              <p className={styles.infoValue}>{assignments.length}</p>
            </div>
            <div className={styles.metaCard}>
              <p className={styles.infoLabel}>{'报名数'}</p>
              <p className={styles.infoValue}>{enrollments.length}</p>
            </div>
          </div>
        </div>
      </section>

      {feedback.notice ? (
        <section className={styles.feedbackSuccess}>{feedback.notice}</section>
      ) : null}
      {feedback.error ? (
        <section className={styles.feedbackError}>{feedback.error}</section>
      ) : null}

      <section className={styles.twoCol}>
        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>{'课程报名'}</h2>
              <p className={styles.panelText}>
                {'填写姓名和邮箱后，会立即向 Supabase 写入一条新的报名记录。'}
              </p>
            </div>
            <span className={`${styles.tag} ${styles.tagSky}`}>
              {'写入动作'}
            </span>
          </div>

          <form action={enrollInCourse} className={styles.form}>
            <input type="hidden" name="courseId" value={course.id} />
            <label className={styles.field}>
              {'姓名'}
              <input
                name="studentName"
                className={styles.input}
                placeholder="例如：高同学"
                required
              />
            </label>
            <label className={styles.field}>
              {'邮箱'}
              <input
                name="studentEmail"
                type="email"
                className={styles.input}
                placeholder="例如：you@example.com"
                required
              />
            </label>
            <button type="submit" className={styles.buttonPrimary}>
              {'提交报名信息'}
            </button>
          </form>
        </article>

        <article className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>{'最新报名'}</h2>
              <p className={styles.panelText}>
                {'用来验证报名表单已经真正打通数据库写入。'}
              </p>
            </div>
            <span className={`${styles.tag} ${styles.tagSlate}`}>
              {'实时回显'}
            </span>
          </div>

          <div className={styles.list}>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment, index) => (
                <div key={enrollment.id} className={styles.listCard}>
                  <div className={styles.listHeader}>
                    <p className={styles.listTitle}>
                      {enrollment.student_name}
                    </p>
                    <span className={`${styles.tag} ${styles.tagSlate}`}>
                      {'第 '}
                      {index + 1}
                      {' 条'}
                    </span>
                  </div>
                  <p className={styles.listMeta}>{enrollment.student_email}</p>
                </div>
              ))
            ) : (
              <p className={styles.emptyState}>
                {
                  '还没有报名记录。提交左侧表单后，这里会立即显示第一条真实数据。'
                }
              </p>
            )}
          </div>
        </article>
      </section>

      <section>
        <header>
          <p className={styles.sectionEyebrow}>Assignment Flow</p>
          <h2 className={styles.sectionTitle}>{'作业提交演示'}</h2>
          <p className={styles.sectionText}>
            {
              '每个作业都可以填写提交内容并保存到 Supabase，提交后下方记录会立即刷新。'
            }
          </p>
        </header>

        <div className={styles.assignmentSection}>
          {assignments.map((assignment) => {
            const assignmentSubmissions = submissions.filter(
              (submission) => submission.assignment_id === assignment.id,
            )

            return (
              <article
                key={assignment.id}
                id={`assignment-${assignment.id}`}
                className={styles.assignmentCard}
              >
                <div className={styles.assignmentHeader}>
                  <div>
                    <h3 className={styles.panelTitle}>{assignment.title}</h3>
                    <p className={styles.panelText}>{assignment.description}</p>
                  </div>
                  <span className={`${styles.tag} ${styles.tagSky}`}>
                    Assignment
                  </span>
                </div>

                <form action={submitAssignment} className={styles.form}>
                  <input type="hidden" name="courseId" value={course.id} />
                  <input
                    type="hidden"
                    name="assignmentId"
                    value={assignment.id}
                  />
                  <div className={styles.formGrid}>
                    <label className={styles.field}>
                      {'姓名'}
                      <input
                        name="studentName"
                        className={styles.input}
                        placeholder="例如：高同学"
                        required
                      />
                    </label>
                    <label className={styles.field}>
                      {'邮箱'}
                      <input
                        name="studentEmail"
                        type="email"
                        className={styles.input}
                        placeholder="例如：you@example.com"
                        required
                      />
                    </label>
                  </div>
                  <label className={styles.field}>
                    {'提交内容'}
                    <textarea
                      name="content"
                      className={styles.textarea}
                      placeholder="请描述你的实现思路、技术选型以及最终交付内容。"
                      required
                    />
                  </label>
                  <button type="submit" className={styles.buttonPrimary}>
                    {'提交作业'}
                  </button>
                </form>

                <div className={styles.submissionList}>
                  <h4 className={styles.sectionEyebrow}>{'最新提交记录'}</h4>
                  {assignmentSubmissions.length > 0 ? (
                    assignmentSubmissions.map((submission, index) => (
                      <div key={submission.id} className={styles.listCard}>
                        <div className={styles.listHeader}>
                          <p className={styles.listTitle}>
                            {submission.student_name}
                            {' · '}
                            {submission.student_email}
                          </p>
                          <span className={`${styles.tag} ${styles.tagSlate}`}>
                            {'提交 '}
                            {index + 1}
                          </span>
                        </div>
                        <p className={styles.listMeta}>
                          {createSubmissionSnippet(submission.content, 160)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyState}>
                      {
                        '当前作业还没有提交记录。填写上方表单后，这里会展示最新的真实数据。'
                      }
                    </p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
