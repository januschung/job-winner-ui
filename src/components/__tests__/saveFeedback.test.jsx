// Saves must report what actually happened: success only after the server
// confirms it, an error (with the dialog still open) when it fails.
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { vi } from 'vitest';
import '../../i18n';
import {
  UPDATE_FREQUENT_URL,
  UPDATE_QUESTION,
  UPDATE_JOB_APPLICATION,
  UPDATE_PROFILE,
} from '../../graphql/mutation';
import { GET_JOB_APPLICATIONS, GET_PROFILE } from '../../graphql/query';
import AddOrEditFrequentUrlDialog from '../AddOrEditFrequentUrlDialog';
import AddOrEditQuestionDialog from '../AddOrEditQuestionDialog';
import { SnackbarProvider } from '../common/SnackbarContext';
import ApplicationForm from '../forms/ApplicationForm';
import ProfileDialog from '../ProfileDialog';
import { ThemeContextProvider } from '../ThemeContext';

const anyVariables = () => true;
const failing = query => ({
  request: { query },
  variableMatcher: anyVariables,
  error: new Error('Server unavailable'),
});
const succeeding = (query, data) => ({
  request: { query },
  variableMatcher: anyVariables,
  result: { data },
});

const renderWith = (ui, mocks) =>
  render(
    <ThemeContextProvider>
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnackbarProvider>{ui}</SnackbarProvider>
      </MockedProvider>
    </ThemeContextProvider>
  );

const application = {
  id: '1',
  companyName: 'Acme Widgets',
  jobTitle: 'Frontend Engineer',
  salaryRange: '$1',
  description: '',
  note: '',
  jobUrl: '',
  status: 'active',
  appliedDate: '2026-10-02',
};

describe('job application save', () => {
  test('a failed save shows an error and keeps the dialog open', async () => {
    const handleClose = vi.fn();
    renderWith(
      <ApplicationForm
        jobApplication={application}
        handleClose={handleClose}
      />,
      [failing(UPDATE_JOB_APPLICATION)]
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Failed to save the job application.')
    ).not.toBeNull();
    expect(
      screen.queryByText('Job application saved successfully!')
    ).toBeNull();
    expect(handleClose).not.toHaveBeenCalled();
  });

  test('a successful save confirms and closes', async () => {
    const handleClose = vi.fn();
    renderWith(
      <ApplicationForm
        jobApplication={application}
        handleClose={handleClose}
      />,
      [
        succeeding(UPDATE_JOB_APPLICATION, {
          updateJobApplication: application,
        }),
        succeeding(GET_JOB_APPLICATIONS, { allJobApplication: [application] }),
      ]
    );

    const save = screen.getByRole('button', { name: 'Save' });
    fireEvent.click(save);
    // Disabled while in flight, so it cannot be submitted twice.
    expect(save.disabled).toBe(true);

    expect(
      await screen.findByText('Job application saved successfully!')
    ).not.toBeNull();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('profile save', () => {
  test('a failed save shows an error, not success', async () => {
    renderWith(
      <ProfileDialog
        profile={{ firstName: 'Test' }}
        open
        handleClose={vi.fn()}
      />,
      [failing(UPDATE_PROFILE), failing(GET_PROFILE)]
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Failed to save the profile.')
    ).not.toBeNull();
    expect(screen.queryByText('Profile saved successfully!')).toBeNull();
  });
});

describe('bookmark save', () => {
  test('a failed save shows a translated error and keeps the dialog open', async () => {
    const handleClose = vi.fn();
    renderWith(
      <AddOrEditFrequentUrlDialog
        open
        handleClose={handleClose}
        frequentUrl={{ id: '5', title: 'Board', url: 'https://example.com' }}
      />,
      [failing(UPDATE_FREQUENT_URL)]
    );

    expect(screen.getByText('Edit Bookmark')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Failed to save the bookmark.')
    ).not.toBeNull();
    expect(handleClose).not.toHaveBeenCalled();
  });
});

describe('Q&A save', () => {
  test('a failed save shows an error and keeps the dialog open', async () => {
    const handleClose = vi.fn();
    renderWith(
      <AddOrEditQuestionDialog
        open
        handleClose={handleClose}
        question={{ id: '7', question: 'Why us?', answer: 'Because.' }}
      />,
      [failing(UPDATE_QUESTION)]
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Error saving Q&A. Please try again.')
    ).not.toBeNull();
    expect(screen.queryByText('Q&A updated successfully!')).toBeNull();
    expect(handleClose).not.toHaveBeenCalled();
  });
});

// InterviewsForm (immediate status/date saves, failed delete) is covered by
// browser checks: jsdom cannot render its date picker's generated selectors.
