import Link from 'next/link'

import { requireSignedInUser } from '@/lib/guards'
import { getMockCourses } from '@/lib/mock-data'

export default function CoursesPage() {
  const user = requireSignedInUser()
  const courses = getMockCourses()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Demo Courses
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          Course list demo
        </h1>
        <p className="text-sm text-slate-600">Signed in as {user.email}</p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {courses.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition-transform hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-slate-950">
              {course.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {course.summary}
            </p>
            <p className="mt-4 text-sm text-slate-500">
              {course.lessons} lessons · {course.assignments} assignments
            </p>
          </Link>
        ))}
      </section>
    </main>
  )
}
