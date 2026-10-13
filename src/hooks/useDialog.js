import { useState } from 'react';

// Open/closed state for a dialog and the item it shows, if any.
// `refetch`, when given, runs on open and on close.
//
//   const edit = useDialog();
//   edit.handleOpen(bookmark);   // or edit.handleOpen() for none
//   <EditDialog open={edit.open} item={edit.item} onClose={edit.handleClose} />
//
// The item stays set while the dialog closes, so its content does not blank
// out mid-animation; the next handleOpen replaces it.
export default function useDialog(refetch) {
  const [state, setState] = useState({ open: false, item: null });

  const handleOpen = (item = null) => {
    refetch?.();
    setState({ open: true, item });
  };

  const handleClose = () => {
    refetch?.();
    setState(prev => ({ ...prev, open: false }));
  };

  return { open: state.open, item: state.item, handleOpen, handleClose };
}
