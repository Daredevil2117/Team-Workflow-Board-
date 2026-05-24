export const STATUSES = ['Backlog', 'In Progress', 'Done'] as const;
export const PRIORITIES = ['Low', 'Medium', 'High'] as const;

export type TaskStatus = (typeof STATUSES)[number];
export type TaskPriority = (typeof PRIORITIES)[number];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortKey = 'createdAt' | 'updatedAt' | 'priority';

export interface Filters {
  statuses: TaskStatus[];
  priority: TaskPriority | 'All';
  search: string;
  sort: SortKey;
}

export interface TaskDraft {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tagsText: string;
}
