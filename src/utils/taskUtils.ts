import { Filters, PRIORITIES, STATUSES, Task, TaskDraft, TaskPriority, TaskStatus } from '../types';

export const priorityWeight: Record<TaskPriority, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

export function isTaskStatus(value: string): value is TaskStatus {
  return STATUSES.includes(value as TaskStatus);
}

export function isTaskPriority(value: string): value is TaskPriority {
  return PRIORITIES.includes(value as TaskPriority);
}

export function createTaskId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function taskToDraft(task?: Task): TaskDraft {
  return {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'Backlog',
    priority: task?.priority ?? 'Medium',
    assignee: task?.assignee ?? '',
    tagsText: task?.tags.join(', ') ?? '',
  };
}

export function parseTags(tagsText: string): string[] {
  return Array.from(
    new Set(
      tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  );
}

export function filterAndSortTasks(tasks: Task[], filters: Filters): Task[] {
  const query = filters.search.trim().toLowerCase();

  return [...tasks]
    .filter((task) => {
      const statusMatch = filters.statuses.length === 0 || filters.statuses.includes(task.status);
      const priorityMatch = filters.priority === 'All' || task.priority === filters.priority;
      const searchMatch =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      return statusMatch && priorityMatch && searchMatch;
    })
    .sort((a, b) => {
      if (filters.sort === 'priority') {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }

      return new Date(b[filters.sort]).getTime() - new Date(a[filters.sort]).getTime();
    });
}

export function relativeTime(value: string): string {
  const delta = Date.now() - new Date(value).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (delta < minute) return 'updated just now';
  if (delta < hour) return `updated ${Math.floor(delta / minute)} min ago`;
  if (delta < day) return `updated ${Math.floor(delta / hour)} hr ago`;
  return `updated ${Math.floor(delta / day)} day${Math.floor(delta / day) === 1 ? '' : 's'} ago`;
}
