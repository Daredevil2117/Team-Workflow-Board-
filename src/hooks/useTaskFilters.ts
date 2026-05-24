import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filters, PRIORITIES, SortKey, STATUSES, TaskPriority } from '../types';
import { isTaskPriority, isTaskStatus } from '../utils/taskUtils';

const sortKeys: SortKey[] = ['updatedAt', 'createdAt', 'priority'];

function parseFilters(search: string): Filters {
  const params = new URLSearchParams(search);
  const statuses = (params.get('status') ?? '')
    .split(',')
    .filter(isTaskStatus);
  const priorityParam = params.get('priority') ?? 'All';
  const sortParam = params.get('sort') ?? 'updatedAt';

  return {
    statuses,
    priority: isTaskPriority(priorityParam) ? priorityParam : 'All',
    search: params.get('q') ?? '',
    sort: sortKeys.includes(sortParam as SortKey) ? (sortParam as SortKey) : 'updatedAt',
  };
}

function writeFilters(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.statuses.length > 0) params.set('status', filters.statuses.join(','));
  if (filters.priority !== 'All') params.set('priority', filters.priority);
  if (filters.search.trim()) params.set('q', filters.search.trim());
  if (filters.sort !== 'updatedAt') params.set('sort', filters.sort);

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
  window.history.replaceState(null, '', nextUrl);
}

export function useTaskFilters() {
  const filters = useMemo(() => parseFilters(window.location.search), []);

  const setFilters = useCallback((next: Filters | ((current: Filters) => Filters)) => {
    const current = parseFilters(window.location.search);
    writeFilters(typeof next === 'function' ? next(current) : next);
    window.dispatchEvent(new Event('taskfilterschange'));
  }, []);

  const liveFilters = useSyncExternalFilters(filters);

  return { filters: liveFilters, setFilters };
}

function useSyncExternalFilters(initial: Filters): Filters {
  const [version] = useExternalVersion();
  return useMemo(() => {
    version.toString();
    return parseFilters(window.location.search) ?? initial;
  }, [initial, version]);
}

function useExternalVersion(): [number, () => void] {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const update = () => setVersion((value) => value + 1);
    window.addEventListener('popstate', update);
    window.addEventListener('taskfilterschange', update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener('taskfilterschange', update);
    };
  }, []);

  return [version, () => setVersion((value) => value + 1)];
}

export const filterOptions = {
  statuses: STATUSES,
  priorities: ['All', ...PRIORITIES] as Array<TaskPriority | 'All'>,
  sorts: [
    { value: 'updatedAt', label: 'Updated date' },
    { value: 'createdAt', label: 'Created date' },
    { value: 'priority', label: 'Priority' },
  ] as Array<{ value: SortKey; label: string }>,
};
