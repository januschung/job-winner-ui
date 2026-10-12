import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import dayjs from 'dayjs';
import { vi } from 'vitest';
import '../../i18n';
import StatsSummary from '../StatsSummary';
import { ThemeContextProvider } from '../ThemeContext';
import { AppDialogsContext } from '../AppDialogsContext';
import { GET_ALL_INTERVIEWS, GET_ALL_OFFERS } from '../../graphql/query';

const applications = [
  { id: '1', status: 'active' },
  { id: '2', status: 'active' },
  { id: '3', status: 'open' },
  { id: '4', status: 'rejected' },
];

const interview = (id, daysFromNow, status = 'open') => ({
  id,
  jobApplicationId: 1,
  interviewDate: dayjs().add(daysFromNow, 'day').format('YYYY-MM-DD'),
  interviewer: 'Sample Interviewer',
  description: '',
  status,
  jobApplication: null,
});

const mocks = [
  {
    request: { query: GET_ALL_INTERVIEWS },
    result: {
      data: {
        // Only the first counts as upcoming: one is past, one is canceled.
        allInterview: [
          interview('a', 3),
          interview('b', -3),
          interview('c', 5, 'canceled'),
        ],
      },
    },
  },
  {
    request: { query: GET_ALL_OFFERS },
    result: { data: { allOffer: [{ id: 'o1' }, { id: 'o2' }] } },
  },
];

const renderStats = (props = {}, apolloMocks = mocks) =>
  render(
    <ThemeContextProvider>
      <MockedProvider mocks={apolloMocks} addTypename={false}>
        <StatsSummary
          applications={applications}
          selectedStatus="all"
          onSelectStatus={vi.fn()}
          {...props}
        />
      </MockedProvider>
    </ThemeContextProvider>
  );

const statValue = label =>
  within(screen.getByText(label).parentElement).getByText(/^(\d+|–)$/)
    .textContent;

describe('StatsSummary', () => {
  test('shows application, in-progress, upcoming interview and offer counts', async () => {
    renderStats();

    expect(statValue('Applications')).toBe('4');
    expect(statValue('In progress')).toBe('2');
    await waitFor(() => expect(statValue('Upcoming interviews')).toBe('1'));
    await waitFor(() => expect(statValue('Offers')).toBe('2'));
  });

  test('shows a dash when interview or offer counts fail to load', async () => {
    const failing = mocks.map(m => ({
      request: m.request,
      error: new Error('x'),
    }));
    renderStats({}, failing);

    // Loading also shows a dash, so let the mocked requests settle first.
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(statValue('Offers')).toBe('–');
    expect(statValue('Upcoming interviews')).toBe('–');
  });

  test('application and in-progress cards filter by status', async () => {
    const onSelectStatus = vi.fn();
    renderStats({ onSelectStatus, selectedStatus: 'active' });

    const inProgress = screen.getByRole('button', { name: /in progress/i });
    expect(inProgress.getAttribute('aria-pressed')).toBe('true');
    expect(
      screen
        .getByRole('button', { name: /applications/i })
        .getAttribute('aria-pressed')
    ).toBe('false');

    await userEvent.click(
      screen.getByRole('button', { name: /applications/i })
    );
    expect(onSelectStatus).toHaveBeenCalledWith('all');
  });

  test('interview and offer cards open their lists inside the app shell', async () => {
    const dialogs = { openInterviewList: vi.fn(), openOfferList: vi.fn() };
    render(
      <ThemeContextProvider>
        <MockedProvider mocks={mocks} addTypename={false}>
          <AppDialogsContext.Provider value={dialogs}>
            <StatsSummary
              applications={applications}
              selectedStatus="all"
              onSelectStatus={vi.fn()}
            />
          </AppDialogsContext.Provider>
        </MockedProvider>
      </ThemeContextProvider>
    );

    const interviews = screen.getByRole('button', {
      name: /upcoming interviews/i,
    });
    const offers = screen.getByRole('button', { name: /offers/i });
    // They open a list rather than toggle a filter.
    expect(interviews.hasAttribute('aria-pressed')).toBe(false);
    expect(offers.hasAttribute('aria-pressed')).toBe(false);

    await userEvent.click(interviews);
    await userEvent.click(offers);
    expect(dialogs.openInterviewList).toHaveBeenCalledTimes(1);
    expect(dialogs.openOfferList).toHaveBeenCalledTimes(1);
  });

  test('interview and offer cards are not buttons without the app shell', () => {
    renderStats();
    expect(screen.queryByRole('button', { name: /offers/i })).toBeNull();
    expect(
      screen.queryByRole('button', { name: /upcoming interviews/i })
    ).toBeNull();
  });
});
