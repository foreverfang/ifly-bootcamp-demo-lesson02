import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Demo Mode
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          The dynamic demo is already live without login
        </h1>
        <p className="text-base leading-7 text-slate-600">
          To keep the first real full-stack flow simple, the current demo uses
          public course enrollment and assignment submission forms backed by
          Supabase. Authentication can be layered in later without changing the
          monorepo structure.
        </p>
      </section>

      <Link
        className="text-sm font-medium text-slate-950 underline-offset-4 hover:underline"
        href="/courses"
      >
        Open the live course demo
      </Link>
    </main>
  )
}
