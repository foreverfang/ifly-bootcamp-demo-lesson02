# Project Instructions

## Product
- This repository is a monorepo for a course platform.
- `apps/web` is the main user-facing application.
- `apps/playground` is a Vite playground for isolated component and design experiments.
- `supabase/` contains backend infrastructure assets such as SQL migrations and policies.

## Stack
- pnpm workspace + Turborepo
- Next.js App Router + React + Tailwind CSS + shadcn/ui
- Supabase Auth + Postgres + Storage + RLS
- Biome + TypeScript strict mode

## Conventions
- Prefer feature-oriented modules over technical dumping grounds.
- Shared UI belongs in `packages/ui`.
- Shared types and domain contracts belong in `packages/utils`.
- Shared Supabase helpers belong in `packages/supabase`.
- Keep server-only logic out of client components.

