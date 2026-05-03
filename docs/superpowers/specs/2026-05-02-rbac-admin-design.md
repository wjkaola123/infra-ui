# RBAC Permission Admin - Design Document

## 1. Context

**Background:** `infra-ui` is the frontend interface for an RBAC (Role-Based Access Control) permission management system. Working with the existing FastAPI backend `infra-demo`, the frontend uses MSW to mock APIs (seamless integration when backend JWT/RBAC is implemented).

**Goal:** Build an **enterprise internal permission management admin**, classic and practical style, high information density, suitable for administrators' daily high-frequency operations.

**User Profile:** Enterprise internal system administrator, frequently managing users, roles, and permissions.

---

## 2. Design Direction

### Visual Style
- **Classic enterprise software style** — Light theme, blue primary color, high information density
- References: WordPress Admin, GitLab, UFIDA/SAP enterprise software
- Emphasis: Clear, usable, efficient, no flashy elements

### Color Scheme

| Element | Color |
|---------|-------|
| Page Background | #F5F6F8 |
| Sidebar Background | #1E3A5F |
| Sidebar Text | #FFFFFF |
| Primary Color | #2563EB (Blue) |
| Primary Button Hover | #1D4ED8 |
| Primary Text | #111827 |
| Secondary Text | #6B7280 |
| Border/Divider | #E5E7EB |
| Table Background | #FFFFFF |
| Success/Enabled | #10B981 |
| Warning/Disabled | #F59E0B |
| Danger/Delete | #EF4444 |

### Typography
- Primary Font: System default sans-serif (similar to Inter/Roboto)
- Table: 14px
- Labels: 12px

---

## 3. Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo + "Permission Management" + Current User + Logout │
├──────────┬──────────────────────────────────────────────────┤
│          │  Toolbar: [🔍 Search...] [+ Add] [Bulk Actions ▼]   │
│  Sidebar │──────────────────────────────────────────────────│
│          │                                                   │
│  Users   │  Data Table (full height, scrollable)           │
│  Roles   │  - Header: Select All | Column Name (sortable↓)   │
│  Perms   │  - Row: Checkbox | Data | Action Buttons          │
│  Logs    │  - Pagination: < 1 2 3 ... 10 >                  │
│          │                                                   │
├──────────┼──────────────────────────────────────────────────┤
│          │  Status Bar: Total X records                      │
└──────────┴──────────────────────────────────────────────────┘
```

### Responsive Strategy
- Desktop-first (1024px+), mobile not supported
- Sidebar fixed width 220px
- Table horizontal scroll

---

## 4. Sidebar Navigation

- Fixed on left, full height
- Logo + System name at top
- Navigation items:
  - User Management (icon: users)
  - Role Management (icon: shield)
  - Permission Management (icon: key)
  - Operation Logs (icon: clipboard-list)
- Current selected item highlighted (light background)
- Bottom: Current logged-in user info + Logout button

---

## 5. Data Tables

### Toolbar
- Search box: Real-time filter by username/role name
- Add button: Blue primary button "+ Add"
- Bulk actions dropdown: Delete selected / Export

### Pagination
- Position: Bottom right of table
- Style: Previous Page Number... Next Page, items per page selector
- Default: 10 items per page

### User Management Table

| Column | Description | Width |
|--------|-------------|-------|
| Checkbox | Select All/Individual | 40px |
| Username | Click to edit | 150px |
| Assigned Roles | Tag list | 200px |
| Direct Permissions | Tag list | 200px |
| Status | Enabled(Green)/Disabled(Yellow) Badge | 80px |
| Created At | YYYY-MM-DD HH:mm | 150px |
| Actions | Edit/Delete/Assign | 180px |

### Role Management Table

| Column | Description | Width |
|--------|-------------|-------|
| Checkbox | Select All/Individual | 40px |
| Role Name | Click to edit | 150px |
| Permission List | Tag list | 300px |
| Assigned User Count | Number | 100px |
| Created At | YYYY-MM-DD HH:mm | 150px |
| Actions | Edit/Delete | 120px |

### Permission Management Table

| Column | Description | Width |
|--------|-------------|-------|
| Checkbox | Select All/Individual | 40px |
| Permission Name | Chinese name | 150px |
| Permission Key | key (READ/WRITE etc.) | 120px |
| Assigned Role Count | Number | 100px |
| Created At | YYYY-MM-DD HH:mm | 150px |
| Actions | Edit/Delete | 120px |

---

## 6. Modal Dialogs

### Add/Edit User Modal

**Fields:**
- Username: Text input, required, max 20 characters
- Role Assignment: Multi-select dropdown (searchable), shows role names
- Direct Permissions: Multi-select dropdown (searchable), shows permission names
- Status: Toggle (Enabled/Disabled), default enabled
- Cancel / Confirm buttons

**Validation:**
- Username cannot be empty
- Username cannot be duplicate

### Add/Edit Role Modal

**Fields:**
- Role Name: Text input, required, max 20 characters
- Permission Assignment: Multi-select dropdown (searchable), shows permission names
- Cancel / Confirm buttons

### Quick Assign Roles Modal (triggered from user table row actions)

**Fields:**
- Username: Read-only text
- Role Multi-select: Multi-select dropdown
- Cancel / Confirm buttons

### Delete Confirmation Modal

- Warning icon + text "Confirm delete [username]? This action cannot be undone."
- Cancel / Confirm Delete (red button)

---

## 7. Operation Logs Tab

**Table Columns:**

| Column | Description |
|--------|-------------|
| Operation Time | YYYY-MM-DD HH:mm:ss |
| Operator | Username |
| Operation Type | Create/Update/Delete/Assign |
| Target Type | User/Role/Permission |
| Target Name | Specific object name |
| Detail | Detailed description of the operation |

**Log Source:** Mock data, display only (not actually persisted)

---

## 8. Technical Stack

| Layer | Technology Choice |
|-------|-------------------|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v3 + Custom CSS Variables |
| Component Library | Headless UI (Dialog, Menu, Transition, Combobox) |
| State Management | Zustand |
| Table | TanStack Table v8 (headless) |
| Mock API | MSW |
| Icons | Heroicons (outline) |
| Routing | React Router v6 (HashRouter, SPA) |
| Date Formatting | date-fns |

---

## 9. File Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css                    # Global styles + CSS variables
├── mocks/
│   ├── browser.ts               # MSW worker
│   ├── handlers/
│   │   └── index.ts            # API handlers
│   └── data/
│       └── seed.ts             # Seed data
├── store/
│   └── useStore.ts             # Zustand store
├── components/
│   ├── Layout/
│   │   ├── Header.tsx           # Header
│   │   ├── Sidebar.tsx          # Sidebar
│   │   └── Layout.tsx           # Layout container
│   ├── ui/
│   │   ├── Button.tsx           # Button component
│   │   ├── Badge.tsx            # Status badge
│   │   ├── Tag.tsx              # Role/Permission tag
│   │   ├── Modal.tsx            # Modal wrapper
│   │   ├── Select.tsx           # Dropdown select
│   │   ├── Input.tsx            # Input field
│   │   ├── Switch.tsx           # Toggle switch
│   │   ├── Table.tsx            # Table wrapper
│   │   ├── Pagination.tsx       # Pagination
│   │   ├── SearchInput.tsx      # Search input
│   │   └── Dropdown.tsx         # Dropdown menu
│   ├── users/
│   │   ├── UsersPage.tsx        # User management page
│   │   ├── UserTable.tsx        # User table
│   │   └── UserModal.tsx        # User modal
│   ├── roles/
│   │   ├── RolesPage.tsx        # Role management page
│   │   ├── RoleTable.tsx        # Role table
│   │   └── RoleModal.tsx        # Role modal
│   ├── permissions/
│   │   ├── PermissionsPage.tsx # Permission management page
│   │   ├── PermissionTable.tsx # Permission table
│   │   └── PermissionModal.tsx # Permission modal
│   └── logs/
│       └── LogsPage.tsx        # Operation logs page
├── pages/
│   └── index.tsx               # Page entry (routing)
├── types/
│   └── index.ts                # Entity types
├── utils/
│   ├── permissions.ts          # Permission calculation
│   └── formatters.ts           # Date formatting etc.
└── hooks/
    └── usePermissions.ts       # Permission check hook
```

---

## 10. Entity Types

```typescript
type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

interface User {
  id: string;
  name: string;
  roleIds: string[];
  permissionIds: string[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  createdAt: string;
}

interface PermissionEntity {
  id: string;
  name: string;
  key: Permission;
}

interface OperationLog {
  id: string;
  timestamp: string;
  operator: string;
  action: 'create' | 'update' | 'delete' | 'assign';
  targetType: 'user' | 'role' | 'permission';
  targetName: string;
  detail: string;
}
```

---

## 11. API Endpoints (MSW Mocked)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get user list |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |
| GET | /api/roles | Get role list |
| POST | /api/roles | Create role |
| PUT | /api/roles/:id | Update role |
| DELETE | /api/roles/:id | Delete role |
| GET | /api/permissions | Get permission list |
| POST | /api/permissions | Create permission |
| PUT | /api/permissions/:id | Update permission |
| DELETE | /api/permissions/:id | Delete permission |
| POST | /api/users/:id/roles | Assign roles |
| POST | /api/roles/:id/permissions | Assign permissions |
| GET | /api/logs | Get operation logs |

---

## 12. Preset Seed Data

**Users (4):**
- admin (Administrator, all permissions)
- zhangsan (Zhang San, Viewer role)
- lisi (Li Si, Editor role)
- wangwu (Wang Wu, no role)

**Roles (3):**
- Super Administrator (ADMIN)
- Viewer (READ)
- Editor (READ, WRITE)

**Permissions (4):**
- Read (READ)
- Create (WRITE)
- Update (WRITE)
- Delete (DELETE)

---

## 13. Out of Scope

- Real JWT authentication (mock user)
- Backend API implementation
- Mobile adaptation
- Permission condition expressions (ABAC)
- Audit log persistence
- Data export functionality
