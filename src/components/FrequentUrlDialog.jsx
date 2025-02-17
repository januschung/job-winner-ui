import React from 'react';
import FrequentUrlContent from './FrequentUrlContent';
import useDialog from './hooks/useDialog';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';
import CustomDialog from './common/CustomDialog';

export default function FrequentUrlDialog({ handleClose, open, setOpen }) {

  const { dialogOpen, handleOpen, handleClose: handleAddFrequentUrlClose } = useDialog();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title='Bookmarks'
      onAdd={handleOpen}
    >
      <AddOrEditFrequentUrlDialog open={dialogOpen} handleClose={handleAddFrequentUrlClose} />
      <FrequentUrlContent />
    </CustomDialog>
  );
}
