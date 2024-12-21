import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import JobApplicationList from '../JobApplicationList';
import { GET_JOB_APPLICATIONS } from '../../graphql/query';
import { DELETE_JOB_APPLICATION } from '../../graphql/mutation';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

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
          jobUrl: 'http://example.com/job1',
        },
      },
    },
  },
];

// Mock `useSnackbar` to simulate snackbar state
jest.mock('../hooks/useSnackbar', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../hooks/useConfirmDialog', () => ({
  __esModule: true,
  default: jest.fn(),
}));

beforeEach(() => {
  require('../hooks/useSnackbar').default.mockReturnValue({
    snackbarOpen: true,
    snackbarMessage: 'Job application deleted successfully!',
    snackbarSeverity: 'success',
    showSnackbar: jest.fn(),
    handleSnackbarClose: jest.fn(),
  });
  require('../hooks/useConfirmDialog').default.mockReturnValue({
    confirmDialogOpen: true,
    handleConfirmDialogOpen: jest.fn(),
    handleConfirmDialogClose: jest.fn(),
  });
});

describe('JobApplicationList', () => {
  test('renders error message on error', async () => {
    render(
      <MockedProvider mocks={errorMocks} addTypename={false}>
        <JobApplicationList searchTerm="" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
    });
  });

  test('renders job applications when data is fetched', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <JobApplicationList searchTerm="" />
      </MockedProvider>
    );

    // Wait for the data to be fetched
    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
      expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
      expect(screen.getByText('Company B')).toBeInTheDocument();
      expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    });
  });

  test('deletes a job application', async () => {
    render(
      <MockedProvider mocks={deleteMocks} addTypename={false}>
        <JobApplicationList searchTerm="" />
      </MockedProvider>
    );

    // Wait for the job applications to be rendered
    await waitFor(() => {
      expect(screen.getByText('Company A')).toBeInTheDocument();
    });

    // Simulate clicking the delete button for the first job application
    const deleteButton = screen.getAllByText('Delete')[0];
    console.log("zeon check: {}", deleteButton)
    userEvent.click(deleteButton);

    console.log("first check: {}", screen.getAllByText('Delete'))

    // Simulate confirming the deletion in the dialog, index is 2 as there are two job applilcations and hence two existing delete buttons
    const confirmButton = screen.getAllByText('Delete')[2];
    console.log("second check: {}", screen.getAllByText('Delete'))
    userEvent.click(confirmButton);

    // Wait for the job application to be removed from the DOM
    await waitFor(() => {
      expect(screen.queryByText('Company A')).not.toBeInTheDocument();
    });

    // Check that the success message appears
    await waitFor(() => {
      expect(screen.getByText('Job application deleted successfully!')).toBeInTheDocument();
    });
  });
});
