# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
npm run dev      # Start development server at http://localhost:5173
npm run build    # Build for production (tsc check + vite build)
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (uses `@tailwindcss/vite` plugin, NOT `tailwindcss` in postcss)
- **State**: Zustand (`src/store/useStore.ts`)
- **Routing**: React Router v6 (HashRouter - URLs have `#` prefix)
- **API**: Axios with JWT token handling (`src/api/client.ts`)
- **Mocking**: MSW v2 (`src/mocks/`)
- **UI**: Headless UI for accessible components

## Design Tokens (from tailwind.config.js)

| Token | Value | Usage |
|-------|-------|-------|
| primary | #2563EB | Buttons, links, accents |
| primary-hover | #1D4ED8 | Button hover |
| sidebar | #1E3A5F | Sidebar background |
| page | #F5F6F8 | Page background |

## Architecture

### API Layer (`src/api/`)
```
src/api/
├── client.ts          # Axios instance with interceptors
├── endpoints/
│   ├── user.ts       # User CRUD API calls
│   └── auth.ts       # Auth API calls
├── mappers.ts        # Type mapping between frontend and backend
└── index.ts           # Re-exports
```

**Backend base URL**: `http://localhost:8000/api/v1`

### State Management (`src/store/useStore.ts`)
- Zustand store manages all application state
- Users are fetched from real backend API on init
- Roles, permissions, logs use MSW mocks (backend lacks these endpoints)
- Store actions also sync to backend for users

### Routing
- HashRouter (URLs like `http://localhost:5173/#/users`)
- Routes defined in `src/App.tsx`
- Protected by Layout component with Header + Sidebar

### Components (`src/components/`)
- `Layout/` - Header, Sidebar, main Layout wrapper
- `ui/` - Reusable UI primitives (Button, Badge, Tag, Modal, Input, Select, Switch, Pagination)
- `users/` - User management page
- `roles/` - Role management page
- `permissions/` - Permission management page
- `logs/` - Operation logs page

## Backend Integration

**Current status**:
- Users: Real API (`/api/v1/users/`)
- Roles, Permissions, Logs: MSW mocks

**Auth flow**:
1. Tokens stored in localStorage (`access_token`, `refresh_token`)
2. Axios interceptor adds `Authorization: Bearer <token>` to requests
3. 401 responses trigger automatic token refresh
4. Refresh failure clears tokens

## MSW Mocking

MSW intercepts API calls in development. Handlers are in `src/mocks/handlers/index.ts`. Users endpoint was removed from MSW (now uses real backend). Only roles, permissions, and logs still use MSW mocks.

## Data Models

**Frontend User** (src/types/index.ts):
```ts
interface User {
  id: string;
  name: string;           // backend uses 'username'
  roleIds: string[];
  permissionIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}
```

**Backend User** (from FastAPI):
```ts
interface BackendUser {
  id: number;
  username: string;       // frontend maps to 'name'
  email: string;
  is_active: boolean;     // frontend maps to 'status'
  created_at: string | null;
}
```
