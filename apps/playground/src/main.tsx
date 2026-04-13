import { Panel } from '@repo/ui/panel'
import { createRoot } from 'react-dom/client'

function Playground() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '48px 24px 72px',
        background:
          'radial-gradient(circle at top, #dbeafe 0%, #f8fafc 38%, #e2e8f0 100%)',
        color: '#0f172a',
        fontFamily:
          '"Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p
          style={{
            margin: '0 0 12px',
            color: '#334155',
            fontSize: 14,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
          }}
        >
          Monorepo Demo
        </p>
        <h1 style={{ fontSize: 42, margin: '0 0 16px', lineHeight: 1.1 }}>
          Course Platform Delivery Sandbox
        </h1>
        <p
          style={{
            maxWidth: 760,
            color: '#475569',
            margin: '0 0 32px',
            fontSize: 18,
            lineHeight: 1.7,
          }}
        >
          This published page is the lightweight demo surface for the monorepo.
          The repository also includes a Next.js app, shared packages, and a
          Supabase schema draft so the whole project still demonstrates a
          full-stack setup.
        </p>

        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            marginBottom: 24,
          }}
        >
          <Panel
            title="Frontend"
            description="Next.js App Router in apps/web, plus this Vite-based playground for static publishing and isolated UI experiments."
          />
          <Panel
            title="Backend"
            description="Supabase SQL migrations, auth helpers, and RLS-oriented schema boundaries prepared inside the monorepo."
          />
          <Panel
            title="Tooling"
            description="pnpm workspace, Turborepo, strict TypeScript, Biome, and GitHub Actions CI/CD wired for repo-level verification."
          />
        </div>

        <section
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 24,
            background: 'rgba(255,255,255,0.78)',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
            padding: 24,
          }}
        >
          <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>
            What is inside the repo
          </h2>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: '#475569',
              lineHeight: 1.9,
            }}
          >
            <li>`apps/web`: Next.js demo pages for the course platform</li>
            <li>
              `apps/playground`: static deployment target for GitHub Pages
            </li>
            <li>`packages/ui`: shared components consumed by both apps</li>
            <li>`packages/utils`: shared types and business helpers</li>
            <li>`packages/supabase`: env and auth helper boundaries</li>
            <li>`supabase/migrations`: database schema and RLS draft</li>
          </ul>
        </section>
      </div>
    </main>
  )
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

createRoot(rootElement).render(<Playground />)
