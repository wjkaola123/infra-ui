# Permission Create UI — Expand Existing PermissionModal

## Overview

Redesign the existing PermissionModal to support runtime permission creation via the backend API, replacing local-only CRUD operations.

## Backend API

**Endpoint:** POST /api/v1/permissions/
**Auth:** Bearer token with `permissions:write` permission
**Request body:**
```json
{
  "name": "articles:read",
  "description": "Optional description"
}
```

**Name format:** `^[a-z0-9_]+:[a-z0-9_]+$` (e.g., `articles:read`, `dashboard:write`)

**Error responses:** 400 (duplicate), 401 (unauthorized), 403 (forbidden), 422 (invalid format)

## Files to Change

### 1. `src/api/endpoints/permission.ts`
Add `create()` function:
```typescript
export const permissionApi = {
  list: () => client.get<BackendPermission[]>('/roles/permissions'),
  create: (data: { name: string; description?: string }) =>
    client.post<BackendPermission>('/permissions/', data),
}
```

### 2. `src/store/useStore.ts`
- `addPermission(name, description)` → calls `permissionApi.create()` instead of local-only
- On success: update local state, refresh permission list
- On error: throw for modal error display

### 3. `src/components/permissions/PermissionModal.tsx`
**Remove:** `key` Select (READ/WRITE/DELETE/ADMIN pattern)

**Add fields:**
- **Name Input**: Regex validation `^[a-z0-9_]+:[a-z0-9_]+$`, helper text "e.g. articles:read"
- **Description Input**: Optional textarea, max 255 chars

**Validation states:**
| Name value | Submit | Feedback |
|---|---|---|
| Empty | Disabled | — |
| `articles:read` | Enabled | Valid |
| `ArticlesRead` | Disabled | "Use lowercase, colon separator" |
| `ARTICLES:READ` | Disabled | Same |
| `articles-read` | Disabled | Same |

Regex validated on blur + on change after first blur.

**Error handling:**
| HTTP Status | Display |
|---|---|
| 400 duplicate | "Permission 'articles:read' already exists" |
| 401 | Redirect to login |
| 403 | "You don't have permission to create permissions" |
| 422 | "Invalid name format" |
| Network error | "Failed to create permission. Please try again." |

**Success flow:**
1. API returns 201
2. Modal closes
3. Toast: "Permission 'articles:read' created"
4. Table refreshes

## UI Components Reused
- `Modal` — existing modal wrapper
- `Input` — name field
- `Button` — submit + cancel
- Toast notification system (if exists)
