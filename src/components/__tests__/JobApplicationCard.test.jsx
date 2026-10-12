import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import i18n from '../../i18n';
import JobApplicationCard from '../JobApplicationCard';
import { ThemeContextProvider } from '../ThemeContext';

const job = {
  id: '1',
  companyName: 'Acme Widgets',
  jobTitle: 'Frontend Engineer',
  jobUrl: 'https://example.com/job',
  status: 'active',
  appliedDate: '2026-10-02',
  salaryRange: '$120k - $150k',
  description: 'Build things.',
};

const renderCard = (overrides = {}, handlers = {}) =>
  render(
    <ThemeContextProvider>
      <JobApplicationCard
        jobApplication={{ ...job, ...overrides }}
        onEdit={handlers.onEdit ?? vi.fn()}
        onDelete={handlers.onDelete ?? vi.fn()}
      />
    </ThemeContextProvider>
  );

afterEach(() => i18n.changeLanguage('en'));

describe('JobApplicationCard', () => {
  test('shows company, title, localized applied date, salary and status', () => {
    renderCard();
    expect(screen.getByText('Frontend Engineer')).not.toBeNull();
    expect(screen.getByText('Applied Oct 2, 2026')).not.toBeNull();
    expect(screen.getByText('$120k - $150k')).not.toBeNull();
    expect(screen.getByText('Active')).not.toBeNull();
  });

  test('formats the applied date in Spanish', async () => {
    await i18n.changeLanguage('es');
    renderCard();
    expect(screen.getByText('Solicitado el 2 oct 2026')).not.toBeNull();
  });

  test('company name links to the posting in a new tab', () => {
    renderCard();
    const link = screen.getByRole('link', {
      name: 'Acme Widgets: open job posting in a new tab',
    });
    expect(link.getAttribute('href')).toBe('https://example.com/job');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  test('company name is plain text without a job URL', () => {
    renderCard({ jobUrl: '' });
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('Acme Widgets')).not.toBeNull();
  });

  test('edit and delete are labelled buttons', async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    renderCard({}, { onEdit, onDelete });

    await userEvent.click(
      screen.getByRole('button', { name: 'Edit Acme Widgets' })
    );
    await userEvent.click(
      screen.getByRole('button', { name: 'Delete Acme Widgets' })
    );
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test('falls back gracefully for an unknown status and invalid date', () => {
    renderCard({ status: 'Pending', appliedDate: 'someday', salaryRange: '' });
    expect(screen.getByText('Pending')).not.toBeNull();
    expect(screen.getByText('Applied someday')).not.toBeNull();
  });
});
