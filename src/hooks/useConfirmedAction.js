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
  // The item stays set while the dialog closes, so its title does not change
  // mid-animation.
  const [state, setState] = useState({ open: false, item: null });
  const { run, pending } = useAsyncAction();

  const cancel = () => setState(prev => ({ ...prev, open: false }));

  const confirm = async () => {
    if (!state.open) return;
    const { item } = state;
    cancel();
    await run(() => action(item), {
      successMessage,
      errorMessage,
      onSuccess: result => onSuccess?.(item, result),
    });
  };

  return {
    request: item => setState({ open: true, item }),
    item: state.item,
    pending,
    dialogProps: { open: state.open, onCancel: cancel, onConfirm: confirm },
  };
}
