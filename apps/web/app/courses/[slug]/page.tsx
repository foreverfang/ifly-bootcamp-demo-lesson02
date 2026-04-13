import Link from 'next/link'
import { notFound } from 'next/navigation'

import { requireSignedInUser } from '@/lib/guards'
import { getMockCourses } from '@/lib/mock-data'

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getMockCourses().map((course) => ({
    slug: course.slug,
  }))
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  requireSignedInUser()

  const { slug } = await params
  const course = getMockCourses().find((item) => item.slug === slug)

  if (!course) {
    notFound()
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Course Detail
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {course.title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-slate-600">
          {course.summary}
        </p>
      </header>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm md:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">Lessons</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {course.lessons}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Assignments</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {course.assignments}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500">Backend source</p>
          <p className="mt-2 text-lg font-medium text-slate-950">
            Supabase Schema Draft
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-950">
          What this demo shows
        </h2>
        <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
          <li>Shared packages powering a Next.js app inside a monorepo</li>
          <li>Course, role, and assignment data modeled in Supabase SQL</li>
          <li>A clean seam for adding real Auth, Storage, and RLS later</li>
        </ul>
      </section>

      <Link
        href="/dashboard"
        className="inline-flex w-fit items-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
      >
        Open dashboard
      </Link>
    </main>
  )
}
