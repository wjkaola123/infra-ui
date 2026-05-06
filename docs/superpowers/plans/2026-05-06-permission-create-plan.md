# Permission Create UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign PermissionModal to create permissions via backend API with proper name format validation.

**Architecture:** API layer adds `create()` call, store wires it async, modal replaces key Select with name+description inputs and validates regex format client-side.

**Tech Stack:** React 19, TypeScript, Zustand, Axios

---

## File Structure

| File | Change |
|------|--------|
| `src/api/endpoints/permission.ts` | Add `create()` function |
| `src/store/useStore.ts:250-254` | Wire `addPermission` to API call |
| `src/components/permissions/PermissionModal.tsx` | Replace key Select with name/description inputs + validation |
| `src/types/index.ts` | Verify `Permission` type has no key requirement |

---

### Task 1: Add permissionApi.create()

**File:** `src/api/endpoints/permission.ts`

- [ ] **Step 1: Add create function to permissionApi**

```typescript
export const permissionApi = {
  list: async (): Promise<BackendPermission[]> => {
    const response = await apiClient.get<{ data: BackendPermission[] }>('/roles/permissions');
    return response.data.data;
  },
  create: async (data: { name: string; description?: string }): Promise<BackendPermission> => {
    const response = await apiClient.post<BackendPermission>('/permissions/', data);
    return response.data;
  },
};
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/api/endpoints/permission.ts
git commit -m "feat: add permissionApi.create() for permission creation"
```

---

### Task 2: Wire addPermission to API in store

**File:** `src/store/useStore.ts:250-254`

- [ ] **Step 1: Rewrite addPermission to call API**

Replace current local-only implementation:

```typescript
addPermission: async (permission: { name: string; description?: string }) => {
  try {
    const backendPerm = await permissionApi.create({
      name: permission.name,
      description: permission.description,
    });
    const newPerm: PermissionEntity = {
      id: String(backendPerm.id),
      name: backendPerm.name,
      key: (backendPerm as any).key || 'CUSTOM',
    };
    set((state) => ({ permissions: [...state.permissions, newPerm] }));
    get().addLog(`Created permission: ${permission.name}`);
    return { success: true };
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'Create failed';
    console.error('Failed to create permission:', errorMessage);
    return { success: false, error: errorMessage };
  }
},
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/store/useStore.ts
git commit -m "feat: wire addPermission to permissionApi.create()"
```

---

### Task 3: Redesign PermissionModal

**File:** `src/components/permissions/PermissionModal.tsx`

- [ ] **Step 1: Write new modal with name/description fields and validation**

Replace entire file:

```tsx
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: { id: string; name: string; key?: string } | null;
}

const PERMISSION_NAME_REGEX = /^[a-z0-9_]+:[a-z0-9_]+$/;

function validatePermissionName(name: string): string | null {
  if (!name.trim()) return null;
  if (!PERMISSION_NAME_REGEX.test(name)) {
    return 'Use lowercase, colon separator (e.g. articles:read)';
  }
  return null;
}

export function PermissionModal({ isOpen, onClose, permission }: PermissionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const addPermission = useStore((s) => s.addPermission);
  const updatePermission = useStore((s) => s.updatePermission);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setDescription('');
    } else {
      setName('');
      setDescription('');
    }
    setError(null);
    setTouched(false);
    setSubmitting(false);
  }, [permission, isOpen]);

  const validationError = touched ? validatePermissionName(name) : null;
  const isValid = name.trim() && !validationError;

  const handleSubmit = async () => {
    if (!isValid) return;
    setTouched(true);
    setSubmitting(true);
    setError(null);

    if (permission) {
      updatePermission(permission.id, { name: name.trim() });
      onClose();
      setSubmitting(false);
      return;
    }

    const result = await addPermission({ name: name.trim(), description: description.trim() || undefined });
    setSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to create permission');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={permission ? 'Edit Permission' : 'Create Permission'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!isValid || submitting}>
            {submitting ? 'Creating...' : permission ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <Input
            label="Permission Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g. articles:read"
            maxLength={50}
          />
          {validationError && (
            <p className="mt-1 text-sm text-red-600">{validationError}</p>
          )}
          {!validationError && name.trim() && (
            <p className="mt-1 text-sm text-green-600">Valid format</p>
          )}
        </div>
        {!permission && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this permission controls"
              maxLength={255}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className="mt-1 text-xs text-gray-400">{description.length}/255</p>
          </div>
        )}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: No TypeScript errors

- [ ] **Step 3: Commit**

```bash
git add src/components/permissions/PermissionModal.tsx
git commit -m "feat: redesign PermissionModal with name format validation"
```

---

### Task 4: Verify no mock data for permissions

**File:** `src/mocks/handlers/` and `src/mocks/data/seed.ts`

- [ ] **Step 1: Check mocks directory**

Run: `ls src/mocks/handlers/ && cat src/mocks/data/seed.ts`
Expected: Only logs-related mocks exist; no permission mocks

- [ ] **Step 2: No changes needed** — exploration confirmed no permission mock data exists

---

## Spec Coverage Check

| Spec Section | Task |
|---|---|
| Add permissionApi.create() | Task 1 |
| Wire addPermission to API | Task 2 |
| Remove key Select, add name/description | Task 3 |
| Client-side regex validation | Task 3 |
| Error handling (400/401/403/422) | Task 2 + Task 3 |
| Success flow (close modal, refresh) | Task 2 + Task 3 |
| No mock data for permissions | Task 4 |

## Type Consistency Check

- `permissionApi.create()` returns `Promise<BackendPermission>`
- `addPermission` in store takes `{ name: string; description?: string }`
- Backend permission response mapped to `PermissionEntity` with `id: String(backendPerm.id)`
- `PERMISSION_NAME_REGEX = /^[a-z0-9_]+:[a-z0-9_]+$/` matches spec requirement
