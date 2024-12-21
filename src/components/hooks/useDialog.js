import { useState } from 'react';

export default function useDialog(refetch) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOpen = () => {
    setDialogOpen(true);
    if (refetch) {
      refetch();
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    if (refetch) {
      refetch();
    }
  };

  return { dialogOpen, handleOpen, handleClose };
}
