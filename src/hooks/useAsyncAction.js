import { useState } from 'react';
import { useSnackbar } from '../components/common/SnackbarContext';

// Runs an async action (usually a mutation) and reports the outcome only once
// it is known: a success message after it resolves, an error message if it
// throws. `pending` lets callers disable buttons while it runs.
export default function useAsyncAction() {
  const { showSnackbar } = useSnackbar();
  const [pending, setPending] = useState(false);

  const run = async (
    action,
    { successMessage, errorMessage, onSuccess } = {}
  ) => {
    setPending(true);
    try {
      const result = await action();
      if (successMessage) showSnackbar(successMessage, 'success');
      onSuccess?.(result);
      return { ok: true, result };
    } catch (error) {
      if (errorMessage) showSnackbar(errorMessage, 'error');
      return { ok: false, error };
    } finally {
      setPending(false);
    }
  };

  return { run, pending };
}
