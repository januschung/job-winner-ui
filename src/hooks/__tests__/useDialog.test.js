import { act, renderHook } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import useDialog from '../useDialog';

describe('useDialog', () => {
  test('opens with an item and keeps it while closing', () => {
    const { result } = renderHook(() => useDialog());
    expect(result.current).toMatchObject({ open: false, item: null });

    act(() => result.current.handleOpen({ id: 7 }));
    expect(result.current).toMatchObject({ open: true, item: { id: 7 } });

    act(() => result.current.handleClose());
    expect(result.current).toMatchObject({ open: false, item: { id: 7 } });
  });

  test('opening without an item clears the previous one', () => {
    const { result } = renderHook(() => useDialog());
    act(() => result.current.handleOpen({ id: 7 }));
    act(() => result.current.handleClose());
    act(() => result.current.handleOpen());
    expect(result.current).toMatchObject({ open: true, item: null });
  });

  test('refetches on open and on close', () => {
    const refetch = vi.fn();
    const { result } = renderHook(() => useDialog(refetch));
    act(() => result.current.handleOpen());
    act(() => result.current.handleClose());
    expect(refetch).toHaveBeenCalledTimes(2);
  });
});
