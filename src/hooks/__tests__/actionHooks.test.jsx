import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SnackbarProvider } from '../../components/common/SnackbarContext';
import useAsyncAction from '../useAsyncAction';
import useAutosave from '../useAutosave';
import useConfirmedAction from '../useConfirmedAction';

const showSnackbar = vi.fn();
vi.mock('../../components/common/SnackbarContext', async importOriginal => ({
  ...(await importOriginal()),
  useSnackbar: () => ({ showSnackbar }),
}));

const wrapper = ({ children }) => (
  <SnackbarProvider>{children}</SnackbarProvider>
);

beforeEach(() => showSnackbar.mockClear());

describe('useAsyncAction', () => {
  test('calls onSuccess after the action resolves, with no toast by default', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAsyncAction(), { wrapper });

    let outcome;
    await act(async () => {
      outcome = await result.current.run(() => Promise.resolve(42), {
        errorMessage: 'Failed',
        onSuccess,
      });
    });

    expect(outcome).toEqual({ ok: true, result: 42 });
    expect(onSuccess).toHaveBeenCalledWith(42);
    expect(showSnackbar).not.toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.pending).toBe(false);
  });

  test('a failure sets `error` for inline display, not a toast', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAsyncAction(), { wrapper });

    let outcome;
    await act(async () => {
      outcome = await result.current.run(() => Promise.reject(new Error('x')), {
        errorMessage: 'Failed',
        onSuccess,
      });
    });

    expect(outcome.ok).toBe(false);
    expect(result.current.error).toBe('Failed');
    expect(showSnackbar).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();

    // The next run starts clean.
    await act(() => result.current.run(() => Promise.resolve()));
    expect(result.current.error).toBeNull();
  });

  test('toasts only when asked to', async () => {
    const { result } = renderHook(() => useAsyncAction(), { wrapper });

    await act(() =>
      result.current.run(() => Promise.resolve(), { successToast: 'Deleted' })
    );
    expect(showSnackbar).toHaveBeenCalledWith('Deleted', 'success');

    await act(() =>
      result.current.run(() => Promise.reject(new Error('x')), {
        errorToast: 'Delete failed',
      })
    );
    expect(showSnackbar).toHaveBeenCalledWith('Delete failed', 'error');
    expect(result.current.error).toBeNull();
  });

  test('is pending while the action runs', async () => {
    const { result } = renderHook(() => useAsyncAction(), { wrapper });
    let finish;
    let running;
    act(() => {
      running = result.current.run(
        () => new Promise(resolve => (finish = resolve))
      );
    });
    expect(result.current.pending).toBe(true);
    await act(async () => {
      finish();
      await running;
    });
    expect(result.current.pending).toBe(false);
  });
});

describe('useConfirmedAction', () => {
  test('runs the action only after confirmation, with the requested item', async () => {
    const action = vi.fn(() => Promise.resolve());
    const onSuccess = vi.fn();
    const { result } = renderHook(
      () => useConfirmedAction({ action, successToast: 'Deleted', onSuccess }),
      { wrapper }
    );

    expect(result.current.dialogProps.open).toBe(false);
    act(() => result.current.request({ id: '7' }));
    expect(result.current.dialogProps.open).toBe(true);
    expect(action).not.toHaveBeenCalled();

    await act(() => result.current.dialogProps.onConfirm());

    expect(action).toHaveBeenCalledWith({ id: '7' });
    expect(onSuccess).toHaveBeenCalledWith({ id: '7' }, undefined);
    expect(showSnackbar).toHaveBeenCalledWith('Deleted', 'success');
    expect(result.current.dialogProps.open).toBe(false);
  });

  test('exposes a failure as `error`', async () => {
    const action = vi.fn(() => Promise.reject(new Error('x')));
    const { result } = renderHook(
      () => useConfirmedAction({ action, errorMessage: 'Delete failed' }),
      { wrapper }
    );

    act(() => result.current.request('1'));
    await act(() => result.current.dialogProps.onConfirm());

    expect(result.current.error).toBe('Delete failed');
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });

  test('cancel closes the dialog without running the action', () => {
    const action = vi.fn();
    const { result } = renderHook(() => useConfirmedAction({ action }), {
      wrapper,
    });

    act(() => result.current.request('0'));
    act(() => result.current.dialogProps.onCancel());

    expect(result.current.dialogProps.open).toBe(false);
    expect(action).not.toHaveBeenCalled();
  });
});

describe('useAutosave', () => {
  test('goes idle → saving → saved', async () => {
    const { result } = renderHook(() => useAutosave());
    expect(result.current.status).toBe('idle');

    let finish;
    let saving;
    act(() => {
      saving = result.current.track(
        'a',
        () => new Promise(resolve => (finish = resolve))
      );
    });
    expect(result.current.status).toBe('saving');

    await act(async () => {
      finish();
      await saving;
    });
    expect(result.current.status).toBe('saved');
    expect(result.current.error).toBeNull();
  });

  test('a failure stays until that key saves, and retry runs it again', async () => {
    const action = vi
      .fn()
      .mockRejectedValueOnce(new Error('x'))
      .mockResolvedValueOnce('ok');
    const { result } = renderHook(() => useAutosave());

    await act(() => result.current.track('a', action, { errorMessage: 'No' }));
    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe('No');

    // Another record saving does not clear it.
    await act(() => result.current.track('b', () => Promise.resolve()));
    expect(result.current.status).toBe('error');

    await act(async () => result.current.retryAll());
    expect(action).toHaveBeenCalledTimes(2);
    expect(result.current.status).toBe('saved');
    expect(result.current.error).toBeNull();
  });

  test('uses a custom retry when given', async () => {
    const retry = vi.fn();
    const { result } = renderHook(() => useAutosave());

    await act(() =>
      result.current.track('a', () => Promise.reject(new Error('x')), {
        errorMessage: 'No',
        retry,
      })
    );
    act(() => result.current.retryAll());

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
