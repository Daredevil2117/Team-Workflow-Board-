import { Button, Select, TextInput } from '../../components/ui';
import { Filters, TaskPriority, TaskStatus } from '../../types';
import { filterOptions } from '../../hooks/useTaskFilters';

interface TaskFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const toggleStatus = (status: TaskStatus) => {
    const exists = filters.statuses.includes(status);
    onChange({
      ...filters,
      statuses: exists ? filters.statuses.filter((item) => item !== status) : [...filters.statuses, status],
    });
  };

  return (
    <section className="filters" aria-label="Task filters">
      <TextInput
        label="Search"
        placeholder="Search title or description"
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />
      <div className="status-filter" aria-label="Status filter">
        <span>Status</span>
        <div>
          {filterOptions.statuses.map((status) => (
            <label key={status} className="check-pill">
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => toggleStatus(status)}
              />
              {status}
            </label>
          ))}
        </div>
      </div>
      <Select
        label="Priority"
        value={filters.priority}
        options={filterOptions.priorities.map((priority) => ({ value: priority, label: priority }))}
        onChange={(event) => onChange({ ...filters, priority: event.target.value as TaskPriority | 'All' })}
      />
      <Select
        label="Sort by"
        value={filters.sort}
        options={filterOptions.sorts}
        onChange={(event) => onChange({ ...filters, sort: event.target.value as Filters['sort'] })}
      />
      <Button
        type="button"
        variant="secondary"
        onClick={() => onChange({ statuses: [], priority: 'All', search: '', sort: 'updatedAt' })}
      >
        Clear
      </Button>
    </section>
  );
}
