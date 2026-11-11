import { useState } from 'react';
import { useSnackbar } from '../components/common/SnackbarContext';

// Runs an async action (usually a mutation) and reports the outcome only once
// it is known. `pending` lets callers disable buttons while it runs.
//
// Prefer showing outcomes where they happen:
// - `errorMessage` becomes `error`, for the caller to show inline (dialogs
//   pass it to their footer). It clears when the next run starts.
// - No success message by default: a dialog closing or a list updating
//   already shows that it worked.
// Toasts are for results with nothing else on screen to show them, such as
// a delete from a list whose confirm dialog has closed:
// - `successToast` / `errorToast` show a toast on success / failure.
export default function useAsyncAction() {
  const { showSnackbar } = useSnackbar();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const run = async (
    action,
    { errorMessage, successToast, errorToast, onSuccess } = {}
  ) => {
    setPending(true);
    setError(null);
    try {
      const result = await action();
      if (successToast) showSnackbar(successToast, 'success');
      onSuccess?.(result);
      return { ok: true, result };
    } catch (err) {
      if (errorMessage) setError(errorMessage);
      if (errorToast) showSnackbar(errorToast, 'error');
      return { ok: false, error: err };
    } finally {
      setPending(false);
    }
  };

  return { run, pending, error, clearError: () => setError(null) };
}
