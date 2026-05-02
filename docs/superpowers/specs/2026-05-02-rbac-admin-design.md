# RBAC 权限管理后台 - 设计文档

## 1. Context

**背景:** `infra-ui` 是 RBAC（基于角色的访问控制）权限管理系统的前端界面。配合已有的 FastAPI 后端 `infra-demo`，前端使用 MSW 模拟 API（后端 JWT/RBAC 实现后可无缝对接）。

**目标:** 打造一个**企业内部使用的权限管理后台**，风格经典实用，信息密度高，适合管理员日常高频操作。

**用户画像:** 企业内部系统管理员，需要频繁管理用户、角色、权限。

---

## 2. Design Direction

### 视觉风格
- **经典企业软件风格** — 浅色主题，蓝色主色调，信息密度高
- 参考: WordPress Admin、GitLab、用友/SAP 企业软件
- 强调: 清晰、易用、高效、无花哨

### 色彩方案

| 元素 | 颜色 |
|------|------|
| 页面背景 | #F5F6F8 |
| 侧边栏背景 | #1E3A5F |
| 侧边栏文字 | #FFFFFF |
| 主色调 | #2563EB (蓝色) |
| 主按钮 Hover | #1D4ED8 |
| 文字主色 | #111827 |
| 文字次要 | #6B7280 |
| 边框/分隔线 | #E5E7EB |
| 表格背景 | #FFFFFF |
| 成功/启用 | #10B981 |
| 警告/禁用 | #F59E0B |
| 危险/删除 | #EF4444 |

### 字体
- 主字体: 系统默认 sans-serif (类似 Inter/Roboto)
- 表格: 14px
- 标签: 12px

---

## 3. Layout Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo + "权限管理系统" + 当前用户(管理员) + 退出     │
├──────────┬──────────────────────────────────────────────────┤
│          │  工具栏: [🔍 搜索...] [+ 新增] [批量操作 ▼]      │
│  Sidebar │──────────────────────────────────────────────────│
│          │                                                   │
│  用户管理│  数据表格 (全高，可滚动)                          │
│  角色管理│  - 表头: 全选 | 列名 (可排序↓)                    │
│  权限管理│  - 行: 复选框 | 数据 | 操作按钮                   │
│  操作日志│  - 分页: < 1 2 3 ... 10 >                        │
│          │                                                   │
├──────────┼──────────────────────────────────────────────────┤
│          │  状态栏: 共 X 条记录                              │
└──────────┴──────────────────────────────────────────────────┘
```

### 响应式策略
- 桌面优先（1024px+），不支持移动端
- 侧边栏固定宽度 220px
- 表格横向可滚动

---

## 4. Sidebar Navigation

- 固定左侧，高度撑满
- Logo + 系统名称在顶部
- 导航项:
  - 用户管理 (icon: users)
  - 角色管理 (icon: shield)
  - 权限管理 (icon: key)
  - 操作日志 (icon: clipboard-list)
- 当前选中项高亮（浅色背景）
- 底部: 当前登录用户信息 + 退出按钮

---

## 5. Data Tables

### 工具栏
- 搜索框: 支持按用户名/角色名搜索（实时过滤）
- 新增按钮: 蓝色主按钮 "+ 新增"
- 批量操作下拉: 删除选中 / 导出

### 分页器
- 位置: 表格底部右侧
- 样式: 上一页 页码... 下一页，每页条数选择
- 默认: 每页 10 条

### 用户管理表格

| 列名 | 说明 | 宽度 |
|------|------|------|
| 复选框 | 全选/单选 | 40px |
| 用户名 | 点击可编辑 | 150px |
| 所属角色 | Tag 列表 | 200px |
| 直接权限 | Tag 列表 | 200px |
| 状态 | 启用(绿)/禁用(黄) Badge | 80px |
| 创建时间 | YYYY-MM-DD HH:mm | 150px |
| 操作 | 编辑/删除/分配 | 180px |

### 角色管理表格

| 列名 | 说明 | 宽度 |
|------|------|------|
| 复选框 | 全选/单选 | 40px |
| 角色名称 | 点击可编辑 | 150px |
| 权限列表 | Tag 列表 | 300px |
| 关联用户数 | 数字 | 100px |
| 创建时间 | YYYY-MM-DD HH:mm | 150px |
| 操作 | 编辑/删除 | 120px |

### 权限管理表格

| 列名 | 说明 | 宽度 |
|------|------|------|
| 复选框 | 全选/单选 | 40px |
| 权限名称 | 中文名称 | 150px |
| 权限标识 | key (READ/WRITE等) | 120px |
| 关联角色数 | 数字 | 100px |
| 创建时间 | YYYY-MM-DD HH:mm | 150px |
| 操作 | 编辑/删除 | 120px |

---

## 6. Modal Dialogs

### 新增/编辑用户弹窗

**字段:**
- 用户名: 文本输入，必填，最大20字符
- 角色分配: 多选下拉（可搜索），显示角色名称
- 直接权限: 多选下拉（可搜索），显示权限名称
- 状态: 开关（启用/禁用），默认启用
- 取消 / 确定 按钮

**验证:**
- 用户名不能为空
- 用户名不能重复

### 新增/编辑角色弹窗

**字段:**
- 角色名称: 文本输入，必填，最大20字符
- 权限分配: 多选下拉（可搜索），显示权限名称
- 取消 / 确定 按钮

### 分配角色快捷弹窗（从用户表格行操作触发）

**字段:**
- 用户名: 只读文本
- 角色多选: 多选下拉
- 取消 / 确定 按钮

### 删除确认弹窗

- 警告图标 + 文字 "确定删除 [用户名] 吗？此操作不可撤销。"
- 取消 / 确认删除（红色按钮）

---

## 7. 操作日志 Tab

**表格列:**

| 列名 | 说明 |
|------|------|
| 操作时间 | YYYY-MM-DD HH:mm:ss |
| 操作者 | 用户名 |
| 操作类型 | 创建/更新/删除/分配 |
| 目标类型 | 用户/角色/权限 |
| 目标名称 | 具体对象名称 |
| 详情 | 操作的具体内容描述 |

**日志来源:** 模拟数据，仅展示用（不实际记录）

---

## 8. Technical Stack

| 分层 | 技术选型 |
|------|---------|
| 框架 | Vite + React 18 + TypeScript |
| 样式 | Tailwind CSS v3 + 自定义 CSS 变量 |
| 组件库 | Headless UI (Dialog, Menu, Transition, Combobox) |
| 状态管理 | Zustand |
| 表格 | TanStack Table v8 (headless) |
| 模拟API | MSW |
| 图标 | Heroicons (outline) |
| 路由 | React Router v6 (HashRouter，单页面) |
| 日期格式化 | date-fns |

---

## 9. File Structure

```
src/
├── main.tsx
├── App.tsx
├── index.css                    # 全局样式 + CSS 变量
├── mocks/
│   ├── browser.ts               # MSW worker
│   ├── handlers/
│   │   └── index.ts            # API handlers
│   └── data/
│       └── seed.ts             # 预设数据
├── store/
│   └── useStore.ts             # Zustand store
├── components/
│   ├── Layout/
│   │   ├── Header.tsx           # 顶栏
│   │   ├── Sidebar.tsx          # 侧边栏
│   │   └── Layout.tsx           # 布局容器
│   ├── ui/
│   │   ├── Button.tsx           # 按钮组件
│   │   ├── Badge.tsx            # 状态标签
│   │   ├── Tag.tsx              # 角色/权限标签
│   │   ├── Modal.tsx            # 弹窗包装
│   │   ├── Select.tsx           # 下拉选择
│   │   ├── Input.tsx            # 输入框
│   │   ├── Switch.tsx           # 开关
│   │   ├── Table.tsx            # 表格包装
│   │   ├── Pagination.tsx       # 分页器
│   │   ├── SearchInput.tsx      # 搜索框
│   │   └── Dropdown.tsx         # 下拉菜单
│   ├── users/
│   │   ├── UsersPage.tsx        # 用户管理页面
│   │   ├── UserTable.tsx        # 用户表格
│   │   └── UserModal.tsx        # 用户弹窗
│   ├── roles/
│   │   ├── RolesPage.tsx        # 角色管理页面
│   │   ├── RoleTable.tsx        # 角色表格
│   │   └── RoleModal.tsx        # 角色弹窗
│   ├── permissions/
│   │   ├── PermissionsPage.tsx # 权限管理页面
│   │   ├── PermissionTable.tsx # 权限表格
│   │   └── PermissionModal.tsx # 权限弹窗
│   └── logs/
│       └── LogsPage.tsx        # 操作日志页面
├── pages/
│   └── index.tsx               # 页面入口（路由）
├── types/
│   └── index.ts                # 实体类型
├── utils/
│   ├── permissions.ts          # 权限计算
│   └── formatters.ts           # 日期格式化等
└── hooks/
    └── usePermissions.ts       # 权限判断 hook
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
| GET | /api/users | 获取用户列表 |
| POST | /api/users | 创建用户 |
| PUT | /api/users/:id | 更新用户 |
| DELETE | /api/users/:id | 删除用户 |
| GET | /api/roles | 获取角色列表 |
| POST | /api/roles | 创建角色 |
| PUT | /api/roles/:id | 更新角色 |
| DELETE | /api/roles/:id | 删除角色 |
| GET | /api/permissions | 获取权限列表 |
| POST | /api/permissions | 创建权限 |
| PUT | /api/permissions/:id | 更新权限 |
| DELETE | /api/permissions/:id | 删除权限 |
| POST | /api/users/:id/roles | 分配角色 |
| POST | /api/roles/:id/permissions | 分配权限 |
| GET | /api/logs | 获取操作日志 |

---

## 12. Preset Seed Data

**用户 (4):**
- admin (管理员, 所有权限)
- zhangsan (张三, 查看者角色)
- lisi (李四, 编辑者角色)
- wangwu (王五, 无角色)

**角色 (3):**
- 超级管理员 (ADMIN)
- 查看者 (READ)
- 编辑者 (READ, WRITE)

**权限 (4):**
- 读取 (READ)
- 创建 (WRITE)
- 更新 (WRITE)
- 删除 (DELETE)

---

## 13. Out of Scope

- 真实 JWT 认证（模拟用户）
- 后端 API 实现
- 移动端适配
- 权限条件表达式（ABAC）
- 审计日志持久化
- 数据导出功能