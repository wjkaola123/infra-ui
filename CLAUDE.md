# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Only focus on the plan and implementation of frontend.
- If you don't have enough information about backend, ask me to fetch. 

## Dev Commands

```bash
npm run dev     # Start dev server with HMR
npm run build   # Type-check and build for production
npm run lint    # Run ESLint
npm run preview # Preview production build
```

## Architecture

### Tech Stack
- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** (no config file, utility classes only)
- **Zustand** for state management
- **React Router v7** (HashRouter, SPA-style routing)
- **MSW** for API mocking (workers in `public/`)
- **Axios** for HTTP with token auth interceptors

### State Management
Single Zustand store in `src/store/useStore.ts` manages:
- Users, roles, permissions, operation logs
- Pagination state for user list
- Entity selection for modals

User CRUD operations call both local store and backend API (`src/api/`).

### API Layer
- `src/api/client.ts` — Axios instance with auth interceptors and token refresh
- `src/api/endpoints/` — Auth and user endpoint handlers
- `src/api/mappers.ts` — Backend ↔ frontend type mappers

### Pages (HashRouter routes)
- `/login` — Login page
- `/users` — User list with pagination
- `/roles` — Role management
- `/permissions` — Permission management
- `/logs` — Operation logs

### Mock Layer
MSW handlers in `src/mocks/handlers/` intercept API calls in dev mode. Seed data in `src/mocks/data/seed.ts`.

### UI Components
Shared components in `src/components/ui/` (Button, Modal, Switch, Badge, Tag, Select, Input, Pagination). Pages compose these with domain-specific tables and modals.

## Notes

- API base URL configured via `VITE_API_BASE_URL` env var (defaults to `http://localhost:8000/api/v1`)
- Access/refresh tokens stored in `localStorage`
- Local IDs are random strings; backend uses integer IDs (converted in API calls)
- MSW runs as browser workers — `npm run dev` starts mock automatically when in dev mode
- Already pushed locally, this is to trigger remote push