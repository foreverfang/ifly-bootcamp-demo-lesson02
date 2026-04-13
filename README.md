# Course Platform Monorepo Demo

This repository is a minimal full-stack demo organized with:

- `pnpm workspace`
- `turborepo`
- `Next.js + React + Tailwind CSS`
- `Vite playground`
- `Supabase schema and auth boundary helpers`

## Structure

- `apps/web`: the main Next.js App Router demo
- `apps/playground`: a Vite sandbox for isolated UI experiments
- `packages/ui`: shared UI primitives
- `packages/utils`: shared types and domain helpers
- `packages/config`: shared app metadata helpers
- `packages/supabase`: shared Supabase env and auth helpers
- `supabase`: SQL migrations and backend infrastructure drafts

## Demo scope

The current demo uses a simple course-platform theme and includes:

- a marketing home page
- a sign-in entry page
- a demo course list
- a static course detail route
- a role-based dashboard
- a Supabase SQL migration draft with RLS-oriented table design

## Local development

```bash
pnpm install
pnpm --filter @repo/web dev
pnpm --filter @repo/playground dev
pnpm check
pnpm typecheck
pnpm test:utils
```

## GitHub CI/CD

Two GitHub Actions workflows are included:

- `.github/workflows/ci.yml`
  Runs install, Biome checks, TypeScript checks, and the shared Vitest suite on pushes and pull requests.
- `.github/workflows/deploy-pages.yml`
  Builds `apps/playground` as a static Vite site and deploys it to GitHub Pages when code lands on `main`.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In GitHub, open `Settings -> Pages`.
3. Set `Source` to `GitHub Actions`.
4. Push to the `main` branch.

The Vite config automatically detects `GITHUB_REPOSITORY` during Actions runs and sets the correct `base` for project-style Pages URLs such as `https://<user>.github.io/<repo>/`.

## Notes

- `apps/web` remains the main Next.js application in the repo, while `apps/playground` is used as the safest static deployment target for GitHub Pages.
- The Supabase SQL and helper packages are already separated so you can replace the mock session flow with real Supabase Auth later without changing the monorepo shape.
