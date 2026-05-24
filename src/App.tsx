import { useCallback, useMemo, useState } from 'react';
import './App.css';
import { Button, Modal, Toast } from './components/ui';
import { TaskBoard } from './features/tasks/TaskBoard';
import { TaskFilters } from './features/tasks/TaskFilters';
import { TaskForm } from './features/tasks/TaskForm';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useTaskStorage } from './hooks/useTaskStorage';
import { Task } from './types';
import { filterAndSortTasks } from './utils/taskUtils';

function App() {
  const { tasks, upsertTask, updateStatus, storageError, migrationPerformed } = useTaskStorage();
  const { filters, setFilters } = useTaskFilters();
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(migrationPerformed ? 'Saved tasks were upgraded to the latest schema.' : null);

  const visibleTasks = useMemo(() => filterAndSortTasks(tasks, filters), [filters, tasks]);

  const closeModal = useCallback(() => {
    if (isDirty && !window.confirm('Discard unsaved task changes?')) return;
    setModalOpen(false);
    setEditingTask(undefined);
    setDirty(false);
  }, [isDirty]);

  const openCreate = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const saveTask = (task: Task) => {
    upsertTask(task);
    setModalOpen(false);
    setEditingTask(undefined);
    setDirty(false);
    setToast('Task saved.');
    window.setTimeout(() => setToast(null), 2600);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Team Workflow Board</p>
          <h1>Plan, assign, and move work across the team.</h1>
        </div>
        <Button onClick={openCreate}>New task</Button>
      </header>

      {storageError ? (
        <div className="alert" role="alert">
          Storage is unavailable. Changes may not persist: {storageError}
        </div>
      ) : null}

      <TaskFilters filters={filters} onChange={setFilters} />
      <TaskBoard tasks={visibleTasks} totalTasks={tasks.length} onEdit={openEdit} onStatusChange={updateStatus} />

      <Modal open={isModalOpen} title={editingTask ? 'Edit task' : 'Create task'} onClose={closeModal}>
        <TaskForm task={editingTask} onCancel={closeModal} onSave={saveTask} onDirtyChange={setDirty} />
      </Modal>

      <div className="toast-region" aria-live="polite">
        {toast ? <Toast tone={migrationPerformed ? 'warning' : 'success'}>{toast}</Toast> : null}
      </div>
    </div>
  );
}

export default App;
