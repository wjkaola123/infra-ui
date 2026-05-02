# RBAC 权限管理后台 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建经典企业风格的 RBAC 权限管理后台，浅色主题，侧边导航 + 数据表格布局，高信息密度，适合管理员日常操作。

**Architecture:** 单页应用，React Router 做页面路由，Zustand 管理状态，TanStack Table 做数据表格，MSW 模拟 API，Tailwind CSS 实现经典企业风格 UI。

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS v3, Headless UI, Zustand, TanStack Table v8, MSW, Heroicons, date-fns

---

## 文件结构

```
src/
├── main.tsx                          # 入口，MSW 初始化
├── App.tsx                           # 根组件，路由配置
├── index.css                         # 全局样式 + CSS 变量
├── mocks/
│   ├── browser.ts                    # MSW worker
│   ├── handlers/
│   │   └── index.ts                 # API handlers
│   └── data/
│       └── seed.ts                  # 预设数据
├── store/
│   └── useStore.ts                  # Zustand store
├── components/
│   ├── Layout/
│   │   ├── Header.tsx               # 顶栏
│   │   ├── Sidebar.tsx              # 侧边栏
│   │   └── Layout.tsx               # 布局容器
│   ├── ui/
│   │   ├── Button.tsx               # 按钮
│   │   ├── Badge.tsx                # 状态标签
│   │   ├── Tag.tsx                  # 角色/权限标签
│   │   ├── Modal.tsx                # 弹窗包装
│   │   ├── Select.tsx               # 下拉选择
│   │   ├── Input.tsx                # 输入框
│   │   ├── Switch.tsx               # 开关
│   │   ├── Pagination.tsx           # 分页器
│   │   └── SearchInput.tsx          # 搜索框
│   ├── users/
│   │   ├── UsersPage.tsx            # 用户管理页面
│   │   ├── UserTable.tsx            # 用户表格
│   │   └── UserModal.tsx            # 用户弹窗
│   ├── roles/
│   │   ├── RolesPage.tsx            # 角色管理页面
│   │   ├── RoleTable.tsx            # 角色表格
│   │   └── RoleModal.tsx            # 角色弹窗
│   ├── permissions/
│   │   ├── PermissionsPage.tsx      # 权限管理页面
│   │   ├── PermissionTable.tsx      # 权限表格
│   │   └── PermissionModal.tsx      # 权限弹窗
│   └── logs/
│       └── LogsPage.tsx             # 操作日志页面
├── types/
│   └── index.ts                     # 实体类型
├── utils/
│   ├── permissions.ts               # 权限计算
│   └── formatters.ts                # 日期格式化
└── hooks/
    └── usePermissions.ts            # 权限判断 hook
```

---

## 依赖安装

- [ ] **Step 1: 安装额外依赖**

Run:
```bash
cd /home/wj/projects/infra-ui
npm install @tanstack/react-table date-fns react-router-dom
```

---

## Task 1: 全局样式与 CSS 变量

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: 更新 `src/index.css` — 全局样式**

```css
@import "tailwindcss";

:root {
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-bg-page: #F5F6F8;
  --color-bg-sidebar: #1E3A5F;
  --color-bg-card: #FFFFFF;
  --color-border: #E5E7EB;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
}

* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--color-text-primary);
  background-color: var(--color-bg-page);
  margin: 0;
  padding: 0;
}

/* 移除 input/button 默认样式重置 */
input, button, select, textarea {
  font-family: inherit;
}
```

- [ ] **Step 2: 更新 `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        sidebar: '#1E3A5F',
        page: '#F5F6F8',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: 提交**

```bash
git add src/index.css tailwind.config.js
git commit -m "feat: add global styles and Tailwind config for enterprise theme"
```

---

## Task 2: 类型定义

**Files:**
- Modify: `src/types/index.ts` (覆盖旧文件)

- [ ] **Step 1: 写入 `src/types/index.ts`**

```typescript
export type Permission = 'READ' | 'WRITE' | 'DELETE' | 'ADMIN';

export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  roleIds: string[];
  permissionIds: string[];
  status: UserStatus;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissionIds: string[];
  createdAt: string;
}

export interface PermissionEntity {
  id: string;
  name: string;
  key: Permission;
}

export type LogAction = 'create' | 'update' | 'delete' | 'assign';
export type LogTargetType = 'user' | 'role' | 'permission';

export interface OperationLog {
  id: string;
  timestamp: string;
  operator: string;
  action: LogAction;
  targetType: LogTargetType;
  targetName: string;
  detail: string;
}

export type EntityType = 'user' | 'role' | 'permission';

export interface AppState {
  users: User[];
  roles: Role[];
  permissions: PermissionEntity[];
  logs: OperationLog[];

  selectedEntity: { id: string; type: EntityType } | null;
  operationLog: string[];

  selectEntity: (entity: { id: string; type: EntityType } | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addRole: (role: Omit<Role, 'id' | 'createdAt'>) => void;
  updateRole: (id: string, data: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addPermission: (permission: Omit<PermissionEntity, 'id'>) => void;
  updatePermission: (id: string, data: Partial<PermissionEntity>) => void;
  deletePermission: (id: string) => void;
  assignRoles: (userId: string, roleIds: string[]) => void;
  assignPermissions: (roleId: string, permissionIds: string[]) => void;
  addLog: (message: string) => void;
}
```

- [ ] **Step 2: 提交**

```bash
git add src/types/index.ts
git commit -m "feat: update entity types for enterprise RBAC admin"
```

---

## Task 3: 预设数据与 Zustand Store

**Files:**
- Modify: `src/mocks/data/seed.ts`
- Modify: `src/store/useStore.ts`

- [ ] **Step 1: 更新 `src/mocks/data/seed.ts`**

```typescript
import type { User, Role, PermissionEntity, OperationLog } from '../../types';

export const SEED_PERMISSIONS: PermissionEntity[] = [
  { id: 'p1', name: '读取', key: 'READ' },
  { id: 'p2', name: '创建', key: 'WRITE' },
  { id: 'p3', name: '更新', key: 'WRITE' },
  { id: 'p4', name: '删除', key: 'DELETE' },
];

export const SEED_ROLES: Role[] = [
  { id: 'r1', name: '超级管理员', permissionIds: ['p1', 'p2', 'p3', 'p4'], createdAt: '2024-01-01 00:00:00' },
  { id: 'r2', name: '查看者', permissionIds: ['p1'], createdAt: '2024-01-02 00:00:00' },
  { id: 'r3', name: '编辑者', permissionIds: ['p1', 'p2', 'p3'], createdAt: '2024-01-03 00:00:00' },
];

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'admin', roleIds: ['r1'], permissionIds: [], status: 'active', createdAt: '2024-01-01 00:00:00' },
  { id: 'u2', name: '张三', roleIds: ['r2'], permissionIds: [], status: 'active', createdAt: '2024-01-15 10:30:00' },
  { id: 'u3', name: '李四', roleIds: ['r3'], permissionIds: [], status: 'active', createdAt: '2024-02-01 14:20:00' },
  { id: 'u4', name: '王五', roleIds: [], permissionIds: [], status: 'inactive', createdAt: '2024-03-10 09:00:00' },
];

export const SEED_LOGS: OperationLog[] = [
  { id: 'l1', timestamp: '2024-03-15 14:30:00', operator: 'admin', action: 'create', targetType: 'user', targetName: '王五', detail: '新建用户王五' },
  { id: 'l2', timestamp: '2024-03-15 15:00:00', operator: 'admin', action: 'assign', targetType: 'role', targetName: '编辑者', detail: '为用户李四分配角色编辑者' },
  { id: 'l3', timestamp: '2024-03-16 09:15:00', operator: 'admin', action: 'delete', targetType: 'user', targetName: '测试用户', detail: '删除用户测试用户' },
];
```

- [ ] **Step 2: 更新 `src/store/useStore.ts`**

```typescript
import { create } from 'zustand';
import type { AppState, User, Role, PermissionEntity } from '../types';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_LOGS } from '../mocks/data/seed';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useStore = create<AppState>((set, get) => ({
  users: SEED_USERS,
  roles: SEED_ROLES,
  permissions: SEED_PERMISSIONS,
  logs: SEED_LOGS,

  selectedEntity: null,
  operationLog: [],

  selectEntity: (entity) => set({ selectedEntity: entity }),

  addUser: (user) => {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ users: [...state.users, newUser] }));
    get().addLog(`创建用户: ${user.name}`);
  },

  updateUser: (id, data) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    }));
    const name = get().users.find((u) => u.id === id)?.name;
    get().addLog(`更新用户: ${name}`);
  },

  deleteUser: (id) => {
    const user = get().users.find((u) => u.id === id);
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    }));
    get().addLog(`删除用户: ${user?.name}`);
  },

  addRole: (role) => {
    const newRole: Role = {
      ...role,
      id: generateId(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    set((state) => ({ roles: [...state.roles, newRole] }));
    get().addLog(`创建角色: ${role.name}`);
  },

  updateRole: (id, data) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === id ? { ...r, ...data } : r)),
    }));
    const name = get().roles.find((r) => r.id === id)?.name;
    get().addLog(`更新角色: ${name}`);
  },

  deleteRole: (id) => {
    const role = get().roles.find((r) => r.id === id);
    set((state) => ({
      roles: state.roles.filter((r) => r.id !== id),
    }));
    get().addLog(`删除角色: ${role?.name}`);
  },

  addPermission: (permission) => {
    const newPerm: PermissionEntity = { ...permission, id: generateId() };
    set((state) => ({ permissions: [...state.permissions, newPerm] }));
    get().addLog(`创建权限: ${permission.name}`);
  },

  updatePermission: (id, data) => {
    set((state) => ({
      permissions: state.permissions.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
  },

  deletePermission: (id) => {
    const perm = get().permissions.find((p) => p.id === id);
    set((state) => ({
      permissions: state.permissions.filter((p) => p.id !== id),
    }));
    get().addLog(`删除权限: ${perm?.name}`);
  },

  assignRoles: (userId, roleIds) => {
    set((state) => ({
      users: state.users.map((u) => (u.id === userId ? { ...u, roleIds } : u)),
    }));
    const userName = get().users.find((u) => u.id === userId)?.name;
    get().addLog(`分配角色: ${userName}`);
  },

  assignPermissions: (roleId, permissionIds) => {
    set((state) => ({
      roles: state.roles.map((r) => (r.id === roleId ? { ...r, permissionIds } : r)),
    }));
    const roleName = get().roles.find((r) => r.id === roleId)?.name;
    get().addLog(`分配权限: ${roleName}`);
  },

  addLog: (message) =>
    set((state) => ({
      operationLog: [message, ...state.operationLog].slice(0, 3),
    })),
}));
```

- [ ] **Step 3: 提交**

```bash
git add src/mocks/data/seed.ts src/store/useStore.ts
git commit -m "feat: update seed data and Zustand store for enterprise RBAC"
```

---

## Task 4: 布局组件 — Header, Sidebar, Layout

**Files:**
- Create: `src/components/Layout/Header.tsx`
- Create: `src/components/Layout/Sidebar.tsx`
- Create: `src/components/Layout/Layout.tsx`

- [ ] **Step 1: 写入 `src/components/Layout/Header.tsx`**

```tsx
import { useStore } from '../../store/useStore';

export function Header() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
          <span className="text-white font-bold text-sm">RB</span>
        </div>
        <h1 className="text-base font-semibold text-gray-900">权限管理系统</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">当前用户: admin</span>
        <button className="text-sm text-gray-500 hover:text-gray-700">退出</button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 写入 `src/components/Layout/Sidebar.tsx`**

```tsx
import { NavLink } from 'react-router-dom';

const navItems = [
  { path: '/users', label: '用户管理', icon: UsersIcon },
  { path: '/roles', label: '角色管理', icon: ShieldIcon },
  { path: '/permissions', label: '权限管理', icon: KeyIcon },
  { path: '/logs', label: '操作日志', icon: ClipboardIcon },
];

export function Sidebar() {
  return (
    <aside className="w-[220px] bg-sidebar flex flex-col h-full">
      <div className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">A</span>
          </div>
          <div>
            <p className="text-sm text-white">admin</p>
            <p className="text-xs text-white/50">超级管理员</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function KeyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
```

- [ ] **Step 3: 写入 `src/components/Layout/Layout.tsx`**

```tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="h-screen flex flex-col bg-page">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/Layout/Header.tsx src/components/Layout/Sidebar.tsx src/components/Layout/Layout.tsx
git commit -m "feat: add Layout components (Header, Sidebar, Layout)"
```

---

## Task 5: 基础 UI 组件

**Files:**
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Tag.tsx`
- Create: `src/components/ui/Modal.tsx`
- Create: `src/components/ui/Input.tsx`
- Create: `src/components/ui/Select.tsx`
- Create: `src/components/ui/Switch.tsx`
- Create: `src/components/ui/Pagination.tsx`

- [ ] **Step 1: 写入 `src/components/ui/Button.tsx`**

```tsx
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-gray-600 hover:bg-gray-100',
};

const sizeStyles = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: 写入 `src/components/ui/Badge.tsx`**

```tsx
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'default';
  children: React.ReactNode;
}

const variantStyles = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: 写入 `src/components/ui/Tag.tsx`**

```tsx
interface TagProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'gray';
  onRemove?: () => void;
}

const colorStyles = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Tag({ children, color = 'gray', onRemove }: TagProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded ${colorStyles[color]}`}>
      {children}
      {onRemove && (
        <button onClick={onRemove} className="hover:text-red-500">×</button>
      )}
    </span>
  );
}
```

- [ ] **Step 4: 写入 `src/components/ui/Modal.tsx`**

```tsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white rounded-lg shadow-xl">
                <div className="px-6 py-4 border-b border-gray-200">
                  <Dialog.Title className="text-lg font-semibold text-gray-900">{title}</Dialog.Title>
                </div>
                <div className="px-6 py-4">{children}</div>
                {footer && (
                  <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end gap-2">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

- [ ] **Step 5: 写入 `src/components/ui/Input.tsx`**

```tsx
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

- [ ] **Step 6: 写入 `src/components/ui/Select.tsx`**

```tsx
import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  multiple?: boolean;
  placeholder?: string;
}

export function Select({ label, value, onChange, options, multiple = true, placeholder = '选择...' }: SelectProps) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <Listbox value={value} onChange={onChange} multiple={multiple}>
        <div className="relative">
          <Listbox.Button className="w-full px-3 py-2 text-left border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50">
            {value.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <span>{value.length} 项已选</span>
            )}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={({ active }) =>
                    `cursor-pointer px-3 py-2 text-sm ${active ? 'bg-gray-100' : ''}`
                  }
                >
                  {({ selected }) => (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={value.includes(option.value)}
                        onChange={() => {}}
                        className="w-4 h-4 rounded border-gray-300 text-primary"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
```

- [ ] **Step 7: 写入 `src/components/ui/Switch.tsx`**

```tsx
import { Switch as HeadlessSwitch } from '@headlessui/react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className={`${checked ? 'bg-primary' : 'bg-gray-200'} relative inline-flex h-5 w-9 items-center rounded-full transition-colors`}
    >
      <span className="sr-only">{label}</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        } mt-0.5`}
      />
    </HeadlessSwitch>
  );
}
```

- [ ] **Step 8: 写入 `src/components/ui/Pagination.tsx`**

```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一页
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 text-sm border rounded ${
            page === currentPage
              ? 'bg-primary text-white border-primary'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  );
}
```

- [ ] **Step 9: 提交**

```bash
git add src/components/ui/Button.tsx src/components/ui/Badge.tsx src/components/ui/Tag.tsx src/components/ui/Modal.tsx src/components/ui/Input.tsx src/components/ui/Select.tsx src/components/ui/Switch.tsx src/components/ui/Pagination.tsx
git commit -m "feat: add base UI components (Button, Badge, Tag, Modal, Input, Select, Switch, Pagination)"
```

---

## Task 6: 用户管理页面

**Files:**
- Create: `src/components/users/UsersPage.tsx`
- Create: `src/components/users/UserTable.tsx`
- Create: `src/components/users/UserModal.tsx`

- [ ] **Step 1: 写入 `src/components/users/UserModal.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { User } from '../../types';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
  const [name, setName] = useState('');
  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [permissionIds, setPermissionIds] = useState<string[]>([]);
  const [status, setStatus] = useState(true);

  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const addUser = useStore((s) => s.addUser);
  const updateUser = useStore((s) => s.updateUser);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setRoleIds(user.roleIds);
      setPermissionIds(user.permissionIds);
      setStatus(user.status === 'active');
    } else {
      setName('');
      setRoleIds([]);
      setPermissionIds([]);
      setStatus(true);
    }
  }, [user, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (user) {
      updateUser(user.id, {
        name: name.trim(),
        roleIds,
        permissionIds,
        status: status ? 'active' : 'inactive',
      });
    } else {
      addUser({
        name: name.trim(),
        roleIds,
        permissionIds,
        status: status ? 'active' : 'inactive',
      });
    }
    onClose();
  };

  const roleOptions = roles.map((r) => ({ value: r.id, label: r.name }));
  const permOptions = permissions.map((p) => ({ value: p.id, label: p.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? '编辑用户' : '新增用户'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{user ? '保存' : '创建'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="用户名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入用户名"
          maxLength={20}
        />
        <Select
          label="角色分配"
          value={roleIds}
          onChange={setRoleIds}
          options={roleOptions}
          placeholder="选择角色"
        />
        <Select
          label="直接权限"
          value={permissionIds}
          onChange={setPermissionIds}
          options={permOptions}
          placeholder="选择权限"
        />
        <div className="flex items-center gap-3">
          <Switch checked={status} onChange={setStatus} />
          <span className="text-sm text-gray-700">{status ? '启用' : '禁用'}</span>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: 写入 `src/components/users/UserTable.tsx`**

```tsx
import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import type { User } from '../../types';

export function UserTable() {
  const users = useStore((s) => s.users);
  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const deleteUser = useStore((s) => s.deleteUser);

  const getRoleNames = (roleIds: string[]) =>
    roleIds.map((id) => roles.find((r) => r.id === id)?.name || '').filter(Boolean);

  const getPermNames = (permIds: string[]) =>
    permIds.map((id) => permissions.find((p) => p.id === id)?.name || '').filter(Boolean);

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">用户名</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">所属角色</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">直接权限</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">创建时间</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getRoleNames(user.roleIds).map((name) => (
                    <Tag key={name} color="blue">{name}</Tag>
                  ))}
                  {user.roleIds.length === 0 && <span className="text-gray-400 text-sm">-</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getPermNames(user.permissionIds).map((name) => (
                    <Tag key={name} color="amber">{name}</Tag>
                  ))}
                  {user.permissionIds.length === 0 && <span className="text-gray-400 text-sm">-</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={user.status === 'active' ? 'success' : 'warning'}>
                  {user.status === 'active' ? '启用' : '禁用'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{user.createdAt}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">编辑</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">删除</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: 写入 `src/components/users/UsersPage.tsx`**

```tsx
import { useState } from 'react';
import { UserTable } from './UserTable';
import { UserModal } from './UserModal';
import { Button } from '../ui/Button';
import type { User } from '../../types';

export function UsersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">用户管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索用户名..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={handleAdd}>+ 新增用户</Button>
        </div>
      </div>

      <UserTable />

      <UserModal isOpen={modalOpen} onClose={handleClose} user={editingUser} />
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/users/UsersPage.tsx src/components/users/UserTable.tsx src/components/users/UserModal.tsx
git commit -m "feat: add users management page"
```

---

## Task 7: 角色管理页面

**Files:**
- Create: `src/components/roles/RolesPage.tsx`
- Create: `src/components/roles/RoleTable.tsx`
- Create: `src/components/roles/RoleModal.tsx`

- [ ] **Step 1: 写入 `src/components/roles/RoleModal.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { Role } from '../../types';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const [name, setName] = useState('');
  const [permissionIds, setPermissionIds] = useState<string[]>([]);

  const permissions = useStore((s) => s.permissions);
  const addRole = useStore((s) => s.addRole);
  const updateRole = useStore((s) => s.updateRole);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setPermissionIds(role.permissionIds);
    } else {
      setName('');
      setPermissionIds([]);
    }
  }, [role, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (role) {
      updateRole(role.id, { name: name.trim(), permissionIds });
    } else {
      addRole({ name: name.trim(), permissionIds });
    }
    onClose();
  };

  const permOptions = permissions.map((p) => ({ value: p.id, label: p.name }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? '编辑角色' : '新增角色'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{role ? '保存' : '创建'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="角色名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="请输入角色名称"
          maxLength={20}
        />
        <Select
          label="权限分配"
          value={permissionIds}
          onChange={setPermissionIds}
          options={permOptions}
          placeholder="选择权限"
        />
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: 写入 `src/components/roles/RoleTable.tsx`**

```tsx
import { useStore } from '../../store/useStore';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';

export function RoleTable() {
  const roles = useStore((s) => s.roles);
  const permissions = useStore((s) => s.permissions);
  const users = useStore((s) => s.users);

  const getPermNames = (permIds: string[]) =>
    permIds.map((id) => permissions.find((p) => p.id === id)?.name || '').filter(Boolean);

  const getUserCount = (roleId: string) =>
    users.filter((u) => u.roleIds.includes(roleId)).length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">角色名称</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">权限列表</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">关联用户数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">创建时间</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{role.name}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {getPermNames(role.permissionIds).map((name) => (
                    <Tag key={name} color="green">{name}</Tag>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{getUserCount(role.id)}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{role.createdAt}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">编辑</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">删除</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: 写入 `src/components/roles/RolesPage.tsx`**

```tsx
import { useState } from 'react';
import { RoleTable } from './RoleTable';
import { RoleModal } from './RoleModal';
import { Button } from '../ui/Button';
import type { Role } from '../../types';

export function RolesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingRole(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">角色管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索角色名..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={handleAdd}>+ 新增角色</Button>
        </div>
      </div>

      <RoleTable />

      <RoleModal isOpen={modalOpen} onClose={handleClose} role={editingRole} />
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/roles/RolesPage.tsx src/components/roles/RoleTable.tsx src/components/roles/RoleModal.tsx
git commit -m "feat: add roles management page"
```

---

## Task 8: 权限管理页面

**Files:**
- Create: `src/components/permissions/PermissionsPage.tsx`
- Create: `src/components/permissions/PermissionTable.tsx`
- Create: `src/components/permissions/PermissionModal.tsx`

- [ ] **Step 1: 写入 `src/components/permissions/PermissionModal.tsx`**

```tsx
import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import type { PermissionEntity, Permission } from '../../types';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  permission?: PermissionEntity | null;
}

const PERMISSION_OPTIONS: { key: Permission; label: string }[] = [
  { key: 'READ', label: '读取 (READ)' },
  { key: 'WRITE', label: '写入 (WRITE)' },
  { key: 'DELETE', label: '删除 (DELETE)' },
  { key: 'ADMIN', label: '管理 (ADMIN)' },
];

export function PermissionModal({ isOpen, onClose, permission }: PermissionModalProps) {
  const [name, setName] = useState('');
  const [key, setKey] = useState<Permission>('READ');

  const addPermission = useStore((s) => s.addPermission);
  const updatePermission = useStore((s) => s.updatePermission);

  useEffect(() => {
    if (permission) {
      setName(permission.name);
      setKey(permission.key);
    } else {
      setName('');
      setKey('READ');
    }
  }, [permission, isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (permission) {
      updatePermission(permission.id, { name: name.trim(), key });
    } else {
      addPermission({ name: name.trim(), key });
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={permission ? '编辑权限' : '新增权限'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>{permission ? '保存' : '创建'}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input
          label="权限名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="如：用户管理"
          maxLength={20}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">权限标识</label>
          <select
            value={key}
            onChange={(e) => setKey(e.target.value as Permission)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {PERMISSION_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}
```

- [ ] **Step 2: 写入 `src/components/permissions/PermissionTable.tsx`**

```tsx
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function PermissionTable() {
  const permissions = useStore((s) => s.permissions);
  const roles = useStore((s) => s.roles);

  const getRoleCount = (permId: string) =>
    roles.filter((r) => r.permissionIds.includes(permId)).length;

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-10">
              <input type="checkbox" className="rounded border-gray-300" />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">权限名称</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">权限标识</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">关联角色数</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {permissions.map((perm) => (
            <tr key={perm.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{perm.name}</td>
              <td className="px-4 py-3">
                <Badge variant="default">{perm.key}</Badge>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{getRoleCount(perm.id)}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">编辑</Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">删除</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 3: 写入 `src/components/permissions/PermissionsPage.tsx`**

```tsx
import { useState } from 'react';
import { PermissionTable } from './PermissionTable';
import { PermissionModal } from './PermissionModal';
import { Button } from '../ui/Button';
import type { PermissionEntity } from '../../types';

export function PermissionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<PermissionEntity | null>(null);

  const handleEdit = (permission: PermissionEntity) => {
    setEditingPermission(permission);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingPermission(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingPermission(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">权限管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索权限..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={handleAdd}>+ 新增权限</Button>
        </div>
      </div>

      <PermissionTable />

      <PermissionModal isOpen={modalOpen} onClose={handleClose} permission={editingPermission} />
    </div>
  );
}
```

- [ ] **Step 4: 提交**

```bash
git add src/components/permissions/PermissionsPage.tsx src/components/permissions/PermissionTable.tsx src/components/permissions/PermissionModal.tsx
git commit -m "feat: add permissions management page"
```

---

## Task 9: 操作日志页面

**Files:**
- Create: `src/components/logs/LogsPage.tsx`

- [ ] **Step 1: 写入 `src/components/logs/LogsPage.tsx`**

```tsx
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';

const actionVariants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  create: 'success',
  update: 'warning',
  delete: 'danger',
  assign: 'default',
};

export function LogsPage() {
  const logs = useStore((s) => s.logs);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">操作日志</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作者</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">操作类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">目标类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">目标名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">详情</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-500">{log.timestamp}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.operator}</td>
                <td className="px-4 py-3">
                  <Badge variant={actionVariants[log.action]}>{log.action}</Badge>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{log.targetType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{log.targetName}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/logs/LogsPage.tsx
git commit -m "feat: add operation logs page"
```

---

## Task 10: 应用路由与根组件

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: 更新 `src/App.tsx`**

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { UsersPage } from './components/users/UsersPage';
import { RolesPage } from './components/roles/RolesPage';
import { PermissionsPage } from './components/permissions/PermissionsPage';
import { LogsPage } from './components/logs/LogsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<UsersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="logs" element={<LogsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
```

- [ ] **Step 2: 更新 `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');
    return worker.start();
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
```

- [ ] **Step 3: 提交**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat: wire up routing and root component"
```

---

## Task 11: 更新 MSW handlers

**Files:**
- Modify: `src/mocks/handlers/index.ts`

- [ ] **Step 1: 更新 `src/mocks/handlers/index.ts`**

```typescript
import { http, HttpResponse, delay } from 'msw';
import { SEED_USERS, SEED_ROLES, SEED_PERMISSIONS, SEED_LOGS } from '../data/seed';

let users = [...SEED_USERS];
let roles = [...SEED_ROLES];
let permissions = [...SEED_PERMISSIONS];
let logs = [...SEED_LOGS];

const generateId = () => Math.random().toString(36).substring(2, 9);

export const handlers = [
  http.get('/api/users', async () => {
    await delay(100);
    return HttpResponse.json({ data: users });
  }),

  http.post('/api/users', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newUser = {
      id: generateId(),
      name: body.name,
      roleIds: body.roleIds || [],
      permissionIds: body.permissionIds || [],
      status: body.status || 'active',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    users.push(newUser);
    return HttpResponse.json({ data: newUser }, { status: 201 });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    const index = users.findIndex((u) => u.id === params.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...body };
      return HttpResponse.json({ data: users[index] });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete('/api/users/:id', async ({ params }) => {
    await delay(100);
    users = users.filter((u) => u.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/roles', async () => {
    await delay(100);
    return HttpResponse.json({ data: roles });
  }),

  http.post('/api/roles', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newRole = {
      id: generateId(),
      name: body.name,
      permissionIds: body.permissionIds || [],
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    roles.push(newRole);
    return HttpResponse.json({ data: newRole }, { status: 201 });
  }),

  http.put('/api/roles/:id', async ({ params, request }) => {
    await delay(100);
    const body = await request.json() as any;
    const index = roles.findIndex((r) => r.id === params.id);
    if (index !== -1) {
      roles[index] = { ...roles[index], ...body };
      return HttpResponse.json({ data: roles[index] });
    }
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),

  http.delete('/api/roles/:id', async ({ params }) => {
    await delay(100);
    roles = roles.filter((r) => r.id !== params.id);
    return HttpResponse.json({ success: true });
  }),

  http.get('/api/permissions', async () => {
    await delay(100);
    return HttpResponse.json({ data: permissions });
  }),

  http.post('/api/permissions', async ({ request }) => {
    await delay(100);
    const body = await request.json() as any;
    const newPerm = { id: generateId(), name: body.name, key: body.key };
    permissions.push(newPerm);
    return HttpResponse.json({ data: newPerm }, { status: 201 });
  }),

  http.get('/api/logs', async () => {
    await delay(100);
    return HttpResponse.json({ data: logs });
  }),
];
```

- [ ] **Step 2: 提交**

```bash
git add src/mocks/handlers/index.ts
git commit -m "feat: update MSW handlers for enterprise RBAC"
```

---

## 最终检查

### 自检清单

- [ ] Spec 覆盖：每个设计需求都有对应实现
- [ ] 占位符扫描：无 TBD、TODO、未完成部分
- [ ] 类型一致性：类型定义、函数签名在所有任务中一致
- [ ] 文件路径：所有路径精确，无歧义

### 验证方式

1. `npm run dev` 启动开发服务器
2. 访问 http://localhost:5173/#/users 查看用户管理
3. 验证侧边栏导航正常工作
4. 测试新增用户/角色/权限功能
5. 测试表格的增删改操作

---

## 执行选择

**Plan complete and saved to `docs/superpowers/plans/2026-05-02-rbac-admin.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**