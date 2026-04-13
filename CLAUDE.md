# Repository Guide

## Goals
- Build an AI-friendly full-stack monorepo for a course platform.
- Optimize for readable structure, explicit ownership, and reusable packages.

## Directory Intent
- `apps/web`: Next.js application for learners, teachers, and admins.
- `apps/playground`: Vite demo app for experimenting with shared UI.
- `packages/ui`: shared React UI layer.
- `packages/utils`: shared domain types and helpers.
- `packages/config`: shared runtime configuration utilities.
- `packages/supabase`: shared Supabase client helpers and typed contracts.
- `packages/typescript-config`: shared tsconfig presets.
- `supabase`: backend infrastructure, SQL, storage and RLS assets.

## Engineering Rules
- Use strict TypeScript.
- Prefer absolute package imports across workspaces.
- Keep auth and authorization decisions explicit and close to the server boundary.
- Add new packages only when there is a real reuse case.

