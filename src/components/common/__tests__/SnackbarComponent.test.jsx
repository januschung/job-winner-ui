import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SnackbarComponent from '../SnackbarComponent';

describe('SnackbarComponent', () => {
  it('renders the Snackbar with the provided message and severity', () => {
    render(
      <SnackbarComponent
        open={true}
        message="Test message"
        severity="error"
        onClose={jest.fn()}
      />
    );

    // Assert that the message is displayed
    expect(screen.getByText('Test message')).toBeInTheDocument();

    // Assert that the Snackbar has the correct severity
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-filledError'); // Check MUI class for "error"
  });

  it('does not render the Snackbar when open is false', () => {
    render(
      <SnackbarComponent
        open={false}
        message="Test message"
        severity="info"
        onClose={jest.fn()}
      />
    );

    // Assert that the Snackbar is not visible
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('calls the onClose handler when the close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <SnackbarComponent
        open={true}
        message="Closable message"
        severity="success"
        onClose={handleClose}
      />
    );

    // Close the Snackbar using the close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Assert that the onClose handler was called
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('closes automatically after the specified duration', async () => {
    jest.useFakeTimers();
    const handleClose = jest.fn();
    render(
      <SnackbarComponent
        open={true}
        message="Auto-close message"
        severity="warning"
        onClose={handleClose}
      />
    );

    // Fast-forward the timer to trigger auto-close
    jest.advanceTimersByTime(3000);

    // Assert that the onClose handler was called
    expect(handleClose).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
