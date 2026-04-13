import Link from 'next/link'

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-6 px-6 py-16">
      <section className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">
          Sign In
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Supabase Auth will plug in here next
        </h1>
        <p className="text-base leading-7 text-slate-600">
          This demo keeps a simple sign-in entry so the monorepo can show the
          frontend and backend boundaries first. A later step can replace this
          with real Supabase Auth, session management, and protected routes.
        </p>
      </section>

      <Link
        className="text-sm font-medium text-slate-950 underline-offset-4 hover:underline"
        href="/"
      >
        Back to home
      </Link>
    </main>
  )
}
