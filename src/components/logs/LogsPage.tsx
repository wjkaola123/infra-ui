import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import type { ActivityLog, ActivityLogAction, ActivityLogResourceType } from '../../types';

const actionVariants: Record<ActivityLogAction, 'success' | 'warning' | 'danger' | 'default'> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'danger',
};

const actionLabels: Record<ActivityLogAction, string> = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
};

const resourceLabels: Record<ActivityLogResourceType, string> = {
  user: 'User',
  role: 'Role',
  permission: 'Permission',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getResourceName(log: ActivityLog): string {
  if (log.new_value && typeof log.new_value === 'object' && 'name' in log.new_value) {
    return String(log.new_value.name);
  }
  if (log.old_value && typeof log.old_value === 'object' && 'name' in log.old_value) {
    return String(log.old_value.name);
  }
  return `#${log.resource_id}`;
}

function DiffView({ oldValue, newValue }: { oldValue: Record<string, unknown> | null; newValue: Record<string, unknown> | null }) {
  const allKeys = new Set([
    ...Object.keys(oldValue || {}),
    ...Object.keys(newValue || {}),
  ]);

  const changes: Array<{ key: string; oldVal: unknown; newVal: unknown }> = [];

  for (const key of allKeys) {
    const oldVal = oldValue?.[key];
    const newVal = newValue?.[key];
    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({ key, oldVal, newVal });
    }
  }

  if (changes.length === 0) {
    return <span className="text-gray-400">No changes</span>;
  }

  return (
    <div className="space-y-2">
      {changes.map(({ key, oldVal, newVal }) => (
        <div key={key} className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-2 bg-red-50 rounded">
            <span className="font-medium text-red-700">{key}: </span>
            <span className="text-red-600">{oldVal === undefined ? '(无)' : JSON.stringify(oldVal)}</span>
          </div>
          <div className="p-2 bg-green-50 rounded">
            <span className="font-medium text-green-700">{key}: </span>
            <span className="text-green-600">{newVal === undefined ? '(无)' : JSON.stringify(newVal)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function LogDetails({ log }: { log: ActivityLog }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-primary hover:text-primary/80 underline"
      >
        {expanded ? 'Hide Details' : 'View Details'}
      </button>
      {expanded && (
        <div className="p-3 bg-gray-50 rounded-lg space-y-3 text-sm">
          <div>
            <span className="font-medium text-gray-600">IP Address: </span>
            <span className="text-gray-800">{log.ip_address}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Resource ID: </span>
            <span className="text-gray-800">{log.resource_id}</span>
          </div>
          {log.action === 'UPDATE' && (
            <div>
              <span className="font-medium text-gray-600">Changes: </span>
              <DiffView oldValue={log.old_value} newValue={log.new_value} />
            </div>
          )}
          {(log.action === 'CREATE' || log.action === 'DELETE') && (
            <>
              {log.new_value && (
                <div>
                  <span className="font-medium text-gray-600">
                    {log.action === 'CREATE' ? 'Created' : 'Deleted'}:{' '}
                  </span>
                  <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-auto">
                    {JSON.stringify(log.new_value, null, 2)}
                  </pre>
                </div>
              )}
              {log.old_value && (
                <div>
                  <span className="font-medium text-gray-600">
                    {log.action === 'CREATE' ? 'Previous' : 'Before Delete'}:{' '}
                  </span>
                  <pre className="mt-1 p-2 bg-white rounded border border-gray-200 overflow-auto">
                    {JSON.stringify(log.old_value, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function LogsPage() {
  const activityLogs = useStore((s) => s.activityLogs);
  const activityLogsTotal = useStore((s) => s.activityLogsTotal);
  const activityLogsPage = useStore((s) => s.activityLogsPage);
  const activityLogsPageSize = useStore((s) => s.activityLogsPageSize);
  const activityLogsTotalPages = useStore((s) => s.activityLogsTotalPages);
  const activityLogsFilters = useStore((s) => s.activityLogsFilters);
  const fetchActivityLogsFromApi = useStore((s) => s.fetchActivityLogsFromApi);
  const setActivityLogsPage = useStore((s) => s.setActivityLogsPage);
  const setActivityLogsPageSize = useStore((s) => s.setActivityLogsPageSize);
  const setActivityLogsFilters = useStore((s) => s.setActivityLogsFilters);

  const [localStartDate, setLocalStartDate] = useState(activityLogsFilters.start_date?.split('T')[0] || '');
  const [localEndDate, setLocalEndDate] = useState(activityLogsFilters.end_date?.split('T')[0] || '');
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  useEffect(() => {
    fetchActivityLogsFromApi();
  }, []);

  const handleApplyFilters = () => {
    setActivityLogsFilters({
      start_date: localStartDate ? `${localStartDate}T00:00:00` : undefined,
      end_date: localEndDate ? `${localEndDate}T23:59:59` : undefined,
    });
  };

  const handleClearFilters = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    setActivityLogsFilters({
      actor_user_id: undefined,
      resource_type: undefined,
      action: undefined,
      start_date: undefined,
      end_date: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {filtersExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {filtersExpanded && (
        <div className="bg-white p-3 rounded-lg shadow">
          <div className="flex flex-wrap items-end gap-2">
            {/* Resource Type Filter */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500">Resource</label>
              <select
                value={activityLogsFilters.resource_type || ''}
                onChange={(e) => setActivityLogsFilters({ resource_type: e.target.value as ActivityLogResourceType || undefined })}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">All</option>
                <option value="user">User</option>
                <option value="role">Role</option>
                <option value="permission">Permission</option>
              </select>
            </div>

            {/* Action Type Filter */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500">Action</label>
              <select
                value={activityLogsFilters.action || ''}
                onChange={(e) => setActivityLogsFilters({ action: e.target.value as ActivityLogAction || undefined })}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              >
                <option value="">All</option>
                <option value="CREATE">Create</option>
                <option value="UPDATE">Update</option>
                <option value="DELETE">Delete</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1">
              <label className="text-xs text-gray-500">Date</label>
              <input
                type="date"
                value={localStartDate}
                onChange={(e) => setLocalStartDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-28"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={localEndDate}
                onChange={(e) => setLocalEndDate(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-28"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <button
                onClick={handleApplyFilters}
                className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary/90"
              >
                Filter
              </button>
              <button
                onClick={handleClearFilters}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">RESOURCE NAME</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activityLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              activityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {log.actor_username}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={actionVariants[log.action]}>
                      {actionLabels[log.action]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {resourceLabels[log.resource_type]}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {getResourceName(log)}
                  </td>
                  <td className="px-4 py-3">
                    <LogDetails log={log} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {activityLogsTotal > 0 && (
        <Pagination
          currentPage={activityLogsPage}
          totalPages={activityLogsTotalPages}
          totalItems={activityLogsTotal}
          pageSize={activityLogsPageSize}
          onPageChange={setActivityLogsPage}
          onPageSizeChange={setActivityLogsPageSize}
        />
      )}
    </div>
  );
}