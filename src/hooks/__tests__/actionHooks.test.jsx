import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SnackbarProvider } from '../../components/common/SnackbarContext';
import useAsyncAction from '../useAsyncAction';
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
  test('reports success after the action resolves, then calls onSuccess', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAsyncAction(), { wrapper });

    let outcome;
    await act(async () => {
      outcome = await result.current.run(() => Promise.resolve(42), {
        successMessage: 'Saved',
        errorMessage: 'Failed',
        onSuccess,
      });
    });

    expect(outcome).toEqual({ ok: true, result: 42 });
    expect(showSnackbar).toHaveBeenCalledWith('Saved', 'success');
    expect(onSuccess).toHaveBeenCalledWith(42);
    expect(result.current.pending).toBe(false);
  });

  test('reports failure and skips onSuccess when the action throws', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useAsyncAction(), { wrapper });

    let outcome;
    await act(async () => {
      outcome = await result.current.run(() => Promise.reject(new Error('x')), {
        successMessage: 'Saved',
        errorMessage: 'Failed',
        onSuccess,
      });
    });

    expect(outcome.ok).toBe(false);
    expect(showSnackbar).toHaveBeenCalledWith('Failed', 'error');
    expect(showSnackbar).not.toHaveBeenCalledWith('Saved', 'success');
    expect(onSuccess).not.toHaveBeenCalled();
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
      () =>
        useConfirmedAction({ action, successMessage: 'Deleted', onSuccess }),
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
