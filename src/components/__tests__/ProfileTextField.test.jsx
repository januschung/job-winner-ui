import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ProfileTextField from '../ProfileTextField';

vi.mock('../CopyButton', () => ({
  default: function MockCopyButton({ text }) {
    return <button>{text}</button>;
  },
}));


describe('ProfileTextField', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    render(
      <ProfileTextField
        id="firstName"
        label="First Name"
        value="John"
        onChange={mockOnChange}
      />
    );
  });

  test('renders the TextField with the correct label and value', () => {
    const textField = screen.getByLabelText(/First Name/i);
    expect(textField).not.toBeNull();
    expect(textField.value).toBe('John');
  });

  test('calls onChange when the TextField value changes', () => {
    const textField = screen.getByLabelText(/First Name/i);
    fireEvent.change(textField, { target: { value: 'Doe' } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  test('renders the CopyButton with the correct text', () => {
    const copyButton = screen.getByRole('button', { name: 'John' });
    expect(copyButton).not.toBeNull();
  });
});
