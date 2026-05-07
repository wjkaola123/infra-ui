# CLAUDE.md

## Rules

- Only focus on frontend plan and implementation
- If backend info needed, ask user to fetch

## Dev Commands

```bash
docker compose up --build   # Docker dev mode (preferred)
npm run dev                  # Local dev with HMR
npm run build                # Type-check + build
npm run lint                 # ESLint
```

## Docker Dev Mode

- Dockerfile.dev + Vite dev server on port 80
- Volume mount `./src:/app/src:ro` for live reload
- To switch back: `docker compose down && edit docker-compose.yml: dockerfile: Dockerfile && docker compose up --build`

## Tech Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS v4** (utility classes, no config file)
- **Zustand** (single store in `src/store/useStore.ts`)
- **React Router v7** (HashRouter SPA-style)
- **MSW** (browser workers in `public/`, seed data in `src/mocks/data/seed.ts`)
- **Axios** (token auth interceptors in `src/api/client.ts`)

## Project Structure

```
src/
├── api/
│   ├── client.ts          # Axios instance + auth interceptors + token refresh
│   ├── mappers.ts         # Backend ↔ Frontend type mappers
│   ├── index.ts           # API exports
│   └── endpoints/
│       ├── auth.ts        # Login, register, refresh, logout
│       ├── user.ts        # User CRUD
│       ├── role.ts        # Role CRUD + permission assignment
│       └── permission.ts  # Permission CRUD
├── components/
│   ├── Layout/             # Header, Sidebar, Layout
│   ├── ui/                 # Button, Modal, Switch, Badge, Tag, Select, Input, Pagination
│   ├── users/              # UsersPage, UserTable, UserModal
│   ├── roles/              # RolesPage, RoleTable, RoleModal
│   ├── permissions/        # PermissionsPage, PermissionTable, PermissionModal
│   ├── dashboard/          # DashboardPage
│   ├── logs/               # LogsPage
│   └── login/              # LoginPage
├── hooks/
│   └── useUserApi.ts
├── store/
│   └── useStore.ts         # Single Zustand store
├── types/
│   └── index.ts            # User, Role, PermissionEntity, OperationLog types
└── mocks/
    └── data/
        └── seed.ts
```

## API Layer

- `src/api/client.ts` — Axios with auth interceptors + token refresh
- `src/api/endpoints/` — auth, user, role, permission handlers
- `src/api/mappers.ts` — mapBackendUserToUser, mapBackendRoleToRole, mapBackendPermissionToPermission

## Type Mappers

Local IDs are random strings; backend uses integers (converted in API layer):
- `mapBackendUserToUser` — BackendUser → User
- `mapBackendRoleToRole` — BackendRole → Role
- `mapBackendPermissionToPermission` — BackendPermission → PermissionEntity

## Pages (HashRouter routes)

| Route | Component |
|-------|-----------|
| `/login` | LoginPage |
| `/` | DashboardPage |
| `/users` | UsersPage |
| `/roles` | RolesPage |
| `/permissions` | PermissionsPage |
| `/logs` | LogsPage |

## UI Components

`src/components/ui/` — Button, Modal, Switch, Badge, Tag, Select, Input, Pagination

Pages compose these with domain-specific tables and modals.

## Store

Single Zustand store (`useStore.ts`) manages:
- users, roles, permissions arrays
- operation logs
- pagination state for all three entities
- entity selection for modals
- rolesForModal (cached roles list for modal dropdowns)

## Notes

- API base: `VITE_API_BASE_URL` env var (default `http://localhost:8000/api/v1`)
- Tokens in localStorage
- Local IDs are random strings; backend uses integers (converted in API layer)
- `fetchRolesForModal` caches 100 roles for modal dropdowns