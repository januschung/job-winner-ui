import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loading from '../Loading';

vi.mock('@mui/material/styles', () => ({
  ...vi.importActual('@mui/material/styles'),
  useTheme: vi.fn(),
}));

vi.mock('@mui/material', () => ({
  ...vi.importActual('@mui/material'),
  useMediaQuery: vi.fn(),
}));

const mockTheme = {
  breakpoints: {
    down: key => `@media (max-width:${key === 'sm' ? '600px' : '960px'})`,
    between: (start, end) =>
      `@media (min-width:${start === 'sm' ? '600px' : '960px'}) and (max-width:${end === 'md' ? '960px' : '1280px'})`,
  },
};

describe('Loading Component', () => {
  beforeEach(() => {
    useTheme.mockReturnValue(mockTheme);
  });

  it('renders 1 card on mobile', () => {
    // Simulate mobile view by returning true for down('sm')
    useMediaQuery.mockImplementation(query =>
      query.includes('max-width:600px')
    );

    render(<Loading />);

    const cards = screen.getAllByTestId('loading-card');
    expect(cards).toHaveLength(1);
  });

  it('renders 2 cards on small tablets', () => {
    // Simulate tablet view by returning true for between('sm', 'md')
    useMediaQuery.mockImplementation(
      query =>
        query.includes('min-width:600px') && query.includes('max-width:960px')
    );

    render(<Loading />);

    const cards = screen.getAllByTestId('loading-card');
    expect(cards).toHaveLength(2);
  });

  it('renders 3 cards on desktop', () => {
    // Simulate desktop view by returning false for down('sm') and between('sm', 'md')
    useMediaQuery.mockImplementation(query =>
      query.includes('min-width:960px')
    );

    render(<Loading />);

    const cards = screen.getAllByTestId('loading-card');
    expect(cards).toHaveLength(3);
  });
});
