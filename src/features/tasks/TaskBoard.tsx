import { STATUSES, Task, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  totalTasks: number;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskBoard({ tasks, totalTasks, onEdit, onStatusChange }: TaskBoardProps) {
  if (totalTasks === 0) {
    return (
      <div className="empty-state">
        <h2>No tasks yet</h2>
        <p>Create a task to start building your team workflow.</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h2>No matching tasks</h2>
        <p>Adjust filters or clear the search to see more work.</p>
      </div>
    );
  }

  return (
    <section className="board" aria-label="Workflow board">
      {STATUSES.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);
        return (
          <div className="board-column" key={status}>
            <div className="board-column__header">
              <h2>{status}</h2>
              <span>{columnTasks.length}</span>
            </div>
            <div className="board-column__cards">
              {columnTasks.length > 0 ? (
                columnTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onEdit={onEdit} onStatusChange={onStatusChange} />
                ))
              ) : (
                <p className="board-column__empty">No cards in this column.</p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
