import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CopyButton from '../CopyButton';
import { vi } from 'vitest';

beforeAll(() => {
  // Mock the navigator.clipboard object
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    },
  });
});

test('CopyButton copies text to clipboard', async () => {
  const text = 'Test copy text';

  render(<CopyButton text={text} />);

  const button = screen.getByRole('button');

  fireEvent.click(button);

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(text);
});
