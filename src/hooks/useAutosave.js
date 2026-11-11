import { useState } from 'react';

const without = (object, key) =>
  Object.fromEntries(Object.entries(object).filter(([k]) => k !== key));

// Tracks background saves for a form that saves as you go, so it can show
// one status line instead of a message per save.
//
//   const autosave = useAutosave();
//   autosave.track(key, () => mutate(...), { errorMessage, onSuccess, retry });
//
// `key` names what is being saved (e.g. a record id): a later success for
// the same key clears its earlier failure. `retry` defaults to running the
// same action again; pass one that re-reads current values when the user may
// have kept editing.
//
// status: 'idle' (nothing saved yet), 'saving', 'saved', or 'error'.
// While anything has failed, `error` holds the latest failure's message and
// `retryAll()` retries every failed save.
export default function useAutosave() {
  const [inFlight, setInFlight] = useState(0);
  const [saved, setSaved] = useState(false);
  // key -> { message, retry }, in the order they failed.
  const [failures, setFailures] = useState({});

  const track = async (
    key,
    action,
    { errorMessage, onSuccess, retry } = {}
  ) => {
    setInFlight(n => n + 1);
    try {
      const result = await action();
      onSuccess?.(result);
      setSaved(true);
      setFailures(prev => without(prev, key));
      return { ok: true, result };
    } catch (error) {
      const again =
        retry ?? (() => track(key, action, { errorMessage, onSuccess }));
      setFailures(prev => ({
        ...without(prev, key),
        [key]: { message: errorMessage, retry: again },
      }));
      return { ok: false, error };
    } finally {
      setInFlight(n => n - 1);
    }
  };

  const failed = Object.values(failures);
  const status =
    inFlight > 0
      ? 'saving'
      : failed.length > 0
        ? 'error'
        : saved
          ? 'saved'
          : 'idle';

  return {
    track,
    status,
    error: failed.at(-1)?.message ?? null,
    retryAll: () => failed.forEach(({ retry }) => retry()),
  };
}
