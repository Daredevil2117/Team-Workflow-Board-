import { ChangeEvent, memo } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { STATUSES, Task, TaskStatus } from '../../types';
import { relativeTime } from '../../utils/taskUtils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

const priorityTone = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export const TaskCard = memo(function TaskCard({ task, onEdit, onStatusChange }: TaskCardProps) {
  return (
    <Card className="task-card">
      <div className="task-card__topline">
        <Badge tone={priorityTone[task.priority]}>{task.priority}</Badge>
        <span className="task-card__time">{relativeTime(task.updatedAt)}</span>
      </div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-card__meta">
        <span>Assigned to {task.assignee || 'Unassigned'}</span>
      </div>
      <div className="task-card__tags" aria-label="Tags">
        {task.tags.length > 0 ? task.tags.map((tag) => <Badge key={tag}>{tag}</Badge>) : <Badge>no tags</Badge>}
      </div>
      <div className="task-card__actions">
        <Select
          label="Status"
          value={task.status}
          options={STATUSES.map((status) => ({ value: status, label: status }))}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(task.id, event.target.value as TaskStatus)
          }
        />
        <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
          Edit
        </Button>
      </div>
    </Card>
  );
});
