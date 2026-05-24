import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Button, Select, TextArea, TextInput } from '../../components/ui';
import { PRIORITIES, STATUSES, Task, TaskDraft, TaskPriority, TaskStatus } from '../../types';
import { createTaskId, parseTags, taskToDraft } from '../../utils/taskUtils';

interface TaskFormProps {
  task?: Task;
  onCancel: () => void;
  onSave: (task: Task) => void;
  onDirtyChange: (dirty: boolean) => void;
}

type Errors = Partial<Record<keyof TaskDraft, string>>;

function validate(draft: TaskDraft): Errors {
  const errors: Errors = {};
  if (draft.title.trim().length < 3) errors.title = 'Title must be at least 3 characters.';
  if (draft.description.trim().length < 8) errors.description = 'Description must be at least 8 characters.';
  if (!draft.assignee.trim()) errors.assignee = 'Assignee is required.';
  return errors;
}

export function TaskForm({ task, onCancel, onSave, onDirtyChange }: TaskFormProps) {
  const initialDraft = useMemo(() => taskToDraft(task), [task]);
  const [draft, setDraft] = useState<TaskDraft>(initialDraft);
  const [errors, setErrors] = useState<Errors>({});

  const dirty = JSON.stringify(draft) !== JSON.stringify(initialDraft);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function updateField<Field extends keyof TaskDraft>(field: Field, value: TaskDraft[Field]) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const now = new Date().toISOString();
    onSave({
      id: task?.id ?? createTaskId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      priority: draft.priority,
      assignee: draft.assignee.trim(),
      tags: parseTags(draft.tagsText),
      createdAt: task?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <form className="task-form" onSubmit={submit} noValidate>
      <TextInput
        label="Title"
        value={draft.title}
        error={errors.title}
        onChange={(event) => updateField('title', event.target.value)}
      />
      <TextArea
        label="Description"
        rows={5}
        value={draft.description}
        error={errors.description}
        onChange={(event) => updateField('description', event.target.value)}
      />
      <div className="form-grid">
        <Select
          label="Status"
          value={draft.status}
          options={STATUSES.map((status) => ({ value: status, label: status }))}
          onChange={(event) => updateField('status', event.target.value as TaskStatus)}
        />
        <Select
          label="Priority"
          value={draft.priority}
          options={PRIORITIES.map((priority) => ({ value: priority, label: priority }))}
          onChange={(event) => updateField('priority', event.target.value as TaskPriority)}
        />
      </div>
      <TextInput
        label="Assignee"
        value={draft.assignee}
        error={errors.assignee}
        onChange={(event) => updateField('assignee', event.target.value)}
      />
      <TextInput
        label="Tags"
        hint="Separate tags with commas."
        value={draft.tagsText}
        onChange={(event) => updateField('tagsText', event.target.value)}
      />
      <div className="task-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? 'Save task' : 'Create task'}</Button>
      </div>
    </form>
  );
}
