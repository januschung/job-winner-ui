import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SnackbarProvider } from '../common/SnackbarContext';
import JobApplicationList from '../JobApplicationList';
import { GET_JOB_APPLICATIONS } from '../../graphql/query';
import { DELETE_JOB_APPLICATION } from '../../graphql/mutation';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import useDialog from '../../hooks/useDialog';
import i18n from '../../i18n';

// Mock data
const mockApplications = [
  {
    id: '1',
    companyName: 'Company A',
    appliedDate: '2024-01-01',
    jobTitle: 'Frontend Developer',
    salaryRange: '50k - 70k',
    status: 'Pending',
    description: 'Developing cool stuff',
    note: 'whatever',
    jobUrl: 'http://example.com/job1',
  },
  {
    id: '2',
    companyName: 'Company B',
    appliedDate: '2024-02-01',
    jobTitle: 'Backend Developer',
    salaryRange: '60k - 80k',
    status: 'Interview',
    description: 'Building APIs',
    note: 'whatsoever',
    jobUrl: 'http://example.com/job2',
  },
];

// Mock query
const mocks = [
  {
    request: {
      query: GET_JOB_APPLICATIONS,
    },
    result: {
      data: {
        allJobApplication: mockApplications,
      },
    },
  },
];

// Mock query with error
const errorMocks = [
  {
    request: {
      query: GET_JOB_APPLICATIONS,
    },
    error: new Error('An error occurred'),
  },
];

// Mock delete mutation response
const deleteMocks = [
  ...mocks,
  {
    request: {
      query: DELETE_JOB_APPLICATION,
      variables: { id: '1' },
    },
    result: {
      data: {
        deleteJobApplication: {
          id: '1',
          companyName: 'Company A',
          appliedDate: '2024-01-01',
          jobTitle: 'Frontend Developer',
          salaryRange: '50k - 70k',
          status: 'Pending',
          description: 'Developing cool stuff',
          note: 'whatever',
          jobUrl: 'http://example.com/job1',
        },
      },
    },
  },
];

// Mock useDialog hook
vi.mock('../../hooks/useDialog', () => ({
  __esModule: true,
  default: vi.fn(),
}));

beforeEach(() => {
  useDialog.mockReturnValue({
    dialogOpen: true,
    handleOpen: vi.fn(),
    handleClose: vi.fn(),
  });
});

describe('JobApplicationList', () => {
  test('renders error message on error', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <SnackbarProvider>
          <JobApplicationList searchTerm="" />
        </SnackbarProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch data/i)).not.toBeNull();
    });
  });

  test('renders job applications when data is fetched', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnackbarProvider>
          <JobApplicationList searchTerm="" />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(screen.getByText('Company A')).not.toBeNull();
      expect(screen.getByText('Frontend Developer')).not.toBeNull();
      expect(screen.getByText('Company B')).not.toBeNull();
      expect(screen.getByText('Backend Developer')).not.toBeNull();
    });
  });

  test('filters job applications based on search term', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <SnackbarProvider>
          <JobApplicationList searchTerm="Backend" />
        </SnackbarProvider>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText('Company A')).toBeNull();
      expect(screen.getByText('Company B')).not.toBeNull();
    });
  });

  test('deletes a job application', async () => {
    render(
      <MockedProvider mocks={deleteMocks} addTypename={false}>
        <SnackbarProvider>
          <JobApplicationList searchTerm="" />
        </SnackbarProvider>
      </MockedProvider>
    );

    // Wait for the job applications to be rendered
    await waitFor(() => {
      expect(screen.getByText('Company A')).not.toBeNull();
    });

    // Simulate clicking the delete icon for the first job application
    const deleteIcon = screen.getAllByTestId('delete-icon')[0];
    userEvent.click(deleteIcon);

    const confirmButton = screen.getByText('Delete');
    userEvent.click(confirmButton);

    // Wait for the job application to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText('Company A')).toBeNull();
    });

    // Check that the success message appears
    await waitFor(() => {
      expect(
        screen.getByText('Job application deleted successfully!')
      ).not.toBeNull();
    });
  });
});
