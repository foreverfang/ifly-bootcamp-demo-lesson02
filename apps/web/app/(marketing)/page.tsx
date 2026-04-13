import Link from 'next/link'

import { getAppName, getAppTagline } from '@repo/config'

export default function MarketingPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-16">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Course Platform
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          {getAppName()}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-600">
          {getAppTagline()}
        </p>
      </section>

      <section className="flex flex-col gap-3 sm:flex-row">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          href="/sign-in"
        >
          View sign-in
        </Link>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          href="/courses"
        >
          Browse demo courses
        </Link>
      </section>
    </main>
  )
}
