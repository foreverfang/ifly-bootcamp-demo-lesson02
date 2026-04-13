import Link from 'next/link'

import { getDashboardLabel } from '@repo/utils'

import { requireSignedInUser } from '@/lib/guards'
import { getMockPlatformRoles } from '@/lib/mock-data'

export default function DashboardPage() {
  const user = requireSignedInUser()
  const roles = getMockPlatformRoles()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Demo Dashboard
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {getDashboardLabel(roles)}
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          Current demo user: {user.email}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Monorepo stack</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            pnpm + turborepo + monorepo
          </p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Frontend app</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            Next.js + React + Tailwind
          </p>
        </article>
        <article className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <p className="text-sm text-slate-500">Backend layer</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            Supabase Schema + Auth Boundary
          </p>
        </article>
      </section>

      <Link
        href="/courses"
        className="inline-flex w-fit items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
      >
        Back to courses
      </Link>
    </main>
  )
}
