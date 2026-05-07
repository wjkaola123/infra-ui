import { apiClient } from '../client';
import type { ActivityLogFilters, PaginatedActivityLogs } from '../../types';

export interface ApiResponse<T> {
  message: string;
  status: number;
  data: T;
}

export const activityLogApi = {
  list: async (filters?: Partial<ActivityLogFilters>): Promise<PaginatedActivityLogs> => {
    const searchParams = new URLSearchParams();
    if (filters?.page) searchParams.set('page', String(filters.page));
    if (filters?.page_size) searchParams.set('page_size', String(filters.page_size));
    if (filters?.actor_user_id) searchParams.set('actor_user_id', String(filters.actor_user_id));
    if (filters?.resource_type) searchParams.set('resource_type', filters.resource_type);
    if (filters?.action) searchParams.set('action', filters.action);
    if (filters?.start_date) searchParams.set('start_date', filters.start_date);
    if (filters?.end_date) searchParams.set('end_date', filters.end_date);
    const queryString = searchParams.toString();
    const url = queryString ? `/activity-logs/?${queryString}` : '/activity-logs/';
    const response = await apiClient.get<ApiResponse<PaginatedActivityLogs>>(url);
    return response.data.data;
  },
};