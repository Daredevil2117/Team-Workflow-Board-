import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/');
  jest.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('creates a task and shows it on the board', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /new task/i }));
  const dialog = screen.getByRole('dialog', { name: /create task/i });

  fireEvent.change(within(dialog).getByLabelText(/title/i), { target: { value: 'Write release notes' } });
  fireEvent.change(within(dialog).getByLabelText(/description/i), {
    target: { value: 'Prepare the customer-facing release notes for the next workflow update.' },
  });
  fireEvent.change(within(dialog).getByLabelText(/assignee/i), { target: { value: 'Isha' } });
  fireEvent.change(within(dialog).getByLabelText(/tags/i), { target: { value: 'release, docs' } });
  fireEvent.change(within(dialog).getByLabelText(/priority/i), { target: { value: 'High' } });
  fireEvent.click(within(dialog).getByRole('button', { name: /create task/i }));

  expect(screen.getByText('Write release notes')).toBeInTheDocument();
  expect(screen.getByText('Assigned to Isha')).toBeInTheDocument();
  expect(screen.getByText('release')).toBeInTheDocument();
});

test('filters tasks by search text and restores filters from the URL', () => {
  window.history.replaceState(null, '', '/?q=sprint&priority=High');
  render(<App />);

  expect(screen.getByText('Review sprint handoff')).toBeInTheDocument();
  expect(screen.queryByText('Map onboarding checklist')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/search/i)).toHaveValue('sprint');
  expect(screen.getByLabelText(/priority/i)).toHaveValue('High');

  fireEvent.change(screen.getByLabelText(/search/i), { target: { value: 'onboarding' } });
  expect(window.location.search).toContain('q=onboarding');
});
