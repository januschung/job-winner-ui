import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ActionIcons from '../ActionIcons';

describe('ActionIcons Component', () => {
  test('calls onEdit when edit icon is clicked', () => {
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(<ActionIcons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const editIcon = screen.getByTestId('edit-icon');
    fireEvent.click(editIcon);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).not.toHaveBeenCalled();
  });

  test('calls onDelete when delete icon is clicked', () => {
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(<ActionIcons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const deleteIcon = screen.getByTestId('delete-icon');
    fireEvent.click(deleteIcon);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).not.toHaveBeenCalled();
  });

  test('prevents event propagation when stopPropagation is true', async () => {
    const user = userEvent.setup();
    const onEditMock = vi.fn();
    const onDeleteMock = vi.fn();

    render(
      <ActionIcons
        onEdit={onEditMock}
        onDelete={onDeleteMock}
        stopPropagation
      />
    );

    const editIcon = screen.getByTestId('edit-icon');

    const stopPropagationSpy = vi.spyOn(Event.prototype, 'stopPropagation');

    await user.click(editIcon);

    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(onEditMock).toHaveBeenCalledTimes(1);

    stopPropagationSpy.mockRestore();
  });
});
