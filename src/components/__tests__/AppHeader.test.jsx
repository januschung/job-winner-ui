import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '../../i18n';
import AppHeader from '../AppHeader';
import { AppDialogsContext } from '../AppDialogsContext';
import { ThemeContextProvider } from '../ThemeContext';

const renderHeader = (overrides = {}) => {
  const dialogs = {
    openNewJobApplication: vi.fn(),
    openFrequentUrls: vi.fn(),
    openQuestions: vi.fn(),
    openInterviewList: vi.fn(),
    openOfferList: vi.fn(),
    openProfile: vi.fn(),
    profileName: 'Test User',
    interviewCount: 2,
    offerCount: 0,
    interviewsLoading: false,
    offersLoading: false,
    ...overrides,
  };
  const onSearch = vi.fn();
  render(
    <ThemeContextProvider>
      <AppDialogsContext.Provider value={dialogs}>
        <AppHeader searchTerm="" onSearch={onSearch} />
      </AppDialogsContext.Provider>
    </ThemeContextProvider>
  );
  return { dialogs, onSearch };
};

// jsdom ignores media queries, so the desktop toolbar counts as hidden.
const button = name => screen.getByRole('button', { name, hidden: true });

describe('AppHeader', () => {
  test.each([
    ['Bookmarks', 'openFrequentUrls'],
    ['Q&A', 'openQuestions'],
    ['Interview List', 'openInterviewList'],
    ['Offer List', 'openOfferList'],
  ])('%s button opens its dialog', (label, opener) => {
    const { dialogs } = renderHeader();
    fireEvent.click(button(label));
    expect(dialogs[opener]).toHaveBeenCalledTimes(1);
  });

  test('New application opens the new application dialog', () => {
    const { dialogs } = renderHeader();
    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'New application',
        hidden: true,
      })[0]
    );
    expect(dialogs.openNewJobApplication).toHaveBeenCalledTimes(1);
  });

  test('shows the upcoming interview count and hides a zero offer count', () => {
    renderHeader();
    const badges = Array.from(document.querySelectorAll('.MuiBadge-badge'));
    const visible = badges.filter(
      b => !b.classList.contains('MuiBadge-invisible')
    );
    expect(visible.map(b => b.textContent)).toEqual(['2']);
  });

  test('avatar shows profile initials and the menu opens the profile', () => {
    const { dialogs } = renderHeader();
    const account = button('Account menu');
    expect(account.textContent).toBe('TU');
    fireEvent.click(account);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Profile' }));
    expect(dialogs.openProfile).toHaveBeenCalledTimes(1);
  });

  test('"/" focuses search, but not while typing in another field', () => {
    renderHeader();
    const other = document.createElement('input');
    document.body.appendChild(other);

    other.focus();
    fireEvent.keyDown(other, { key: '/' });
    expect(document.activeElement).toBe(other);

    other.blur();
    fireEvent.keyDown(document.body, { key: '/' });
    expect(document.activeElement.getAttribute('aria-label')).toBe('search');
    other.remove();
  });
});
