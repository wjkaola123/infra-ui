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
      <h2 className="text-lg font-semibold text-gray-900">Operation Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Operator</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Target Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
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
