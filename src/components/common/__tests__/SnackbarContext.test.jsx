import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider, useSnackbar } from '../SnackbarContext';

const TestComponent = () => {
    const { showSnackbar } = useSnackbar();

    return (
        <div>
            <button onClick={() => showSnackbar('Test message', 'success')}>
                Show Snackbar
            </button>
        </div>
    );
};

describe('SnackbarContext', () => {
    it('renders the SnackbarComponent when showSnackbar is called', async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        // Verify Snackbar is not initially rendered
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();

        // Simulate clicking the button to show the Snackbar
        const button = screen.getByText('Show Snackbar');
        await userEvent.click(button);

        // Assert that the Snackbar is displayed
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('closes the Snackbar when the auto-hide duration elapses', () => {
        jest.useFakeTimers();
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        // Simulate clicking the button to show the Snackbar
        const button = screen.getByText('Show Snackbar');
        userEvent.click(button);

        // Fast-forward the timer to simulate auto-hide
        jest.advanceTimersByTime(3000);

        // Assert that the Snackbar is no longer visible
        expect(screen.queryByText('Test message')).not.toBeInTheDocument();

        jest.useRealTimers();
    });

    it('closes the Snackbar when the close button is clicked', async () => {
      render(
          <SnackbarProvider>
              <TestComponent />
          </SnackbarProvider>
      );

      // Simulate clicking the button to show the Snackbar
      const button = screen.getByText('Show Snackbar');
      await userEvent.click(button);

      // Assert that the Snackbar is displayed
      expect(screen.getByText('Test message')).toBeInTheDocument();

      // Click the close button in the Snackbar
      const closeButton = screen.getByRole('button', { name: /close/i });
      await userEvent.click(closeButton);

      // Wait for the Snackbar to be removed from the DOM
      await waitFor(() => {
          expect(screen.queryByText('Test message')).not.toBeInTheDocument();
      });
  });
});
