# Role API Integration Design

## Context

前端 Roles 数据从本地 SEED_ROLES 读取，需要改为从后端 API 读取。后端支持分页。

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/roles/` | List roles (paginated) |
| POST | `/api/v1/roles/` | Create role |
| GET | `/api/v1/roles/:id` | Get role |
| PUT | `/api/v1/roles/:id` | Update role |
| DELETE | `/api/v1/roles/:id` | Delete role |
| POST | `/api/v1/roles/:id/permissions` | Assign permissions |
| DELETE | `/api/v1/roles/:id/permissions/:perm_id` | Remove permission |

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/api/endpoints/role.ts` | **Create** - Role API endpoints |
| `src/api/mappers.ts` | **Modify** - Add `mapBackendRoleToRole` |
| `src/api/index.ts` | **Modify** - Export roleApi |
| `src/store/useStore.ts` | **Modify** - Add `fetchRolesFromApi`, roles from API |

## Response Format (Backend)

```typescript
interface PaginatedRolesResponse {
  items: BackendRole[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

interface BackendRole {
  id: number;
  name: string;
  permission_ids: number[];
  created_at: string;
}
```

## Mapper

```typescript
export const mapBackendRoleToRole = (backend: BackendRole): Role => ({
  id: String(backend.id),
  name: backend.name,
  permissionIds: backend.permission_ids.map(String),
  createdAt: backend.created_at,
});
```

## Store Changes

- Add `rolesTotal`, `rolesPage`, `rolesPageSize`, `rolesTotalPages` state
- Add `fetchRolesFromApi(page, pageSize)` method
- Replace `SEED_ROLES` with API call in initialization
- CRUD operations update local state + call API
