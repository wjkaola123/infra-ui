# Plan: Homepage/Dashboard After Login

## Context

Issue #1 from infra-demo repo outlines the RBAC system enhancement with role management APIs. The infra-ui project needs a dedicated dashboard page (`/home`) showing recent activity, with UsersPage remaining as the default index route (`/`). Sidebar gets a "Quick Nav" section for navigation.

## Phases

### Phase 1: Create DashboardPage
- Create `src/components/dashboard/DashboardPage.tsx`
- Display recent activity log table (last 5 entries from store)
- "View All" link to /logs

### Phase 2: Add Route
- Update `src/App.tsx` to add `/home` route pointing to DashboardPage
- Keep `<Route index element={<UsersPage />} />` as default

### Phase 3: Sidebar Quick Nav
- Update `src/components/Layout/Sidebar.tsx`
- Add "Quick Nav" section above nav items with buttons to Users, Roles, Permissions

## Files to Create/Modify

| File | Action | Phase |
|------|--------|-------|
| `src/components/dashboard/DashboardPage.tsx` | **Create** | 1 |
| `src/App.tsx` | **Modify** - add `/home` route | 2 |
| `src/components/Layout/Sidebar.tsx` | **Modify** - add Quick Nav section | 3 |

## DashboardPage Structure (Phase 1)

```
DashboardPage
└── Recent Activity section
    └── Table: timestamp | operator | action (Badge) | detail | targetType | targetName
        └── Limited to 5 most recent, "View All" link to /logs
```

## Routing (Phase 2)

```tsx
<Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
  <Route index element={<UsersPage />} />
  <Route path="home" element={<DashboardPage />} />
  <Route path="users" element={<UsersPage />} />
  <Route path="roles" element={<RolesPage />} />
  <Route path="permissions" element={<PermissionsPage />} />
  <Route path="logs" element={<LogsPage />} />
</Route>
```

## Sidebar Quick Nav (Phase 3)

```tsx
// Quick Nav section
<div className="px-4 py-3 border-b border-white/10">
  <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Quick Nav</p>
  <button onClick={() => navigate('/users')} className="block w-full px-2 py-1.5 text-sm text-white/70 hover:text-white text-left">Users</button>
  <button onClick={() => navigate('/roles')} className="block w-full px-2 py-1.5 text-sm text-white/70 hover:text-white text-left">Roles</button>
  <button onClick={() => navigate('/permissions')} className="block w-full px-2 py-1.5 text-sm text-white/70 hover:text-white text-left">Permissions</button>
</div>
```

## Verification

1. `npm run dev` - dev server
2. Login → redirects to `/` (UsersPage as default, sidebar shows Users active)
3. Click Quick Nav buttons in sidebar → navigate to respective pages
4. Navigate to `/home` → see recent activity table
