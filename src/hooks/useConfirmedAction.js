import { useState } from 'react';
import useAsyncAction from './useAsyncAction';

// Asks for confirmation before running an action on an item (typically a
// delete). Spread `dialogProps` onto <ConfirmDialog>.
//
//   const remove = useConfirmedAction({
//     action: item => deleteThing({ variables: { id: item.id } }),
//     successMessage, errorMessage, onSuccess: item => ...,
//   });
//   remove.request(item);              // opens the dialog
//   <ConfirmDialog {...remove.dialogProps} title=... content=... />
export default function useConfirmedAction({
  action,
  successMessage,
  errorMessage,
  onSuccess,
}) {
  // Wrapped so a falsy item (e.g. id 0) still counts as pending.
  const [target, setTarget] = useState(null);
  const { run, pending } = useAsyncAction();

  const cancel = () => setTarget(null);

  const confirm = async () => {
    if (!target) return;
    const { item } = target;
    setTarget(null);
    await run(() => action(item), {
      successMessage,
      errorMessage,
      onSuccess: result => onSuccess?.(item, result),
    });
  };

  return {
    request: item => setTarget({ item }),
    pending,
    dialogProps: {
      open: target !== null,
      onCancel: cancel,
      onConfirm: confirm,
    },
  };
}
