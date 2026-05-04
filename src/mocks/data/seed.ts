import type { OperationLog } from '../../types';

export const SEED_LOGS: OperationLog[] = [
  { id: 'l1', timestamp: '2024-03-15 14:30:00', operator: 'admin', action: 'create', targetType: 'user', targetName: 'Wang Wu', detail: 'Created user Wang Wu' },
  { id: 'l2', timestamp: '2024-03-15 15:00:00', operator: 'admin', action: 'assign', targetType: 'role', targetName: 'Editor', detail: 'Assigned role Editor to user Li Si' },
  { id: 'l3', timestamp: '2024-03-16 09:15:00', operator: 'admin', action: 'delete', targetType: 'user', targetName: 'Test User', detail: 'Deleted user Test User' },
];