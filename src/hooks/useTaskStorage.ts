import { useCallback, useEffect, useMemo, useState } from 'react';
import { Task } from '../types';
import { createTaskId } from '../utils/taskUtils';

const STORAGE_KEY = 'team-workflow-board';
const CURRENT_SCHEMA_VERSION = 2;

type LegacyTask = {
  id?: string;
  title: string;
  description?: string;
  status?: Task['status'];
};

type StoredV1 = {
  schemaVersion: 1;
  tasks: LegacyTask[];
};

type StoredV2 = {
  schemaVersion: 2;
  tasks: Task[];
};

type StoredData = StoredV1 | StoredV2;

const starterTasks: Task[] = [
  {
    id: 'seed-task-1',
    title: 'Map onboarding checklist',
    description: 'Draft the repeatable checklist for new teammates joining the workflow project.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'Mira',
    tags: ['ops', 'docs'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: 'seed-task-2',
    title: 'Review sprint handoff',
    description: 'Check open risks and move completed cards before the weekly planning session.',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Dev',
    tags: ['planning'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
  },
];

function migrate(data: StoredData): { data: StoredV2; migrated: boolean } {
  if (data.schemaVersion === CURRENT_SCHEMA_VERSION) {
    return { data, migrated: false };
  }

  const now = new Date().toISOString();
  return {
    migrated: true,
    data: {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      tasks: data.tasks.map((task) => ({
        id: task.id ?? createTaskId(),
        title: task.title,
        description: task.description ?? '',
        status: task.status ?? 'Backlog',
        priority: 'Medium',
        assignee: 'Unassigned',
        tags: [],
        createdAt: now,
        updatedAt: now,
      })),
    },
  };
}

function readStoredTasks(): { tasks: Task[]; migrated: boolean; error: string | null } {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { tasks: starterTasks, migrated: false, error: null };
    }

    const parsed = JSON.parse(raw) as StoredData;
    if (!parsed || !Array.isArray(parsed.tasks) || !('schemaVersion' in parsed)) {
      throw new Error('Stored task data is malformed.');
    }

    const result = migrate(parsed);
    if (result.migrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result.data));
    }

    return { tasks: result.data.tasks, migrated: result.migrated, error: null };
  } catch (error) {
    return {
      tasks: starterTasks,
      migrated: false,
      error: error instanceof Error ? error.message : 'Unable to read saved tasks.',
    };
  }
}

export function useTaskStorage() {
  const initial = useMemo(() => readStoredTasks(), []);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [storageError, setStorageError] = useState<string | null>(initial.error);
  const [migrationPerformed] = useState(initial.migrated);

  useEffect(() => {
    try {
      const payload: StoredV2 = { schemaVersion: CURRENT_SCHEMA_VERSION, tasks };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setStorageError(null);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : 'Storage is unavailable.');
    }
  }, [tasks]);

  const upsertTask = useCallback((task: Task) => {
    setTasks((current) => {
      const exists = current.some((item) => item.id === task.id);
      return exists ? current.map((item) => (item.id === task.id ? task : item)) : [task, ...current];
    });
  }, []);

  const updateStatus = useCallback((id: string, status: Task['status']) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status, updatedAt: new Date().toISOString() } : task,
      ),
    );
  }, []);

  return {
    tasks,
    upsertTask,
    updateStatus,
    storageError,
    migrationPerformed,
  };
}
