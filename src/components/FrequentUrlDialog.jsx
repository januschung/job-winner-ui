import React from 'react';
import FrequentUrlContent from './FrequentUrlContent';
import useDialog from '../hooks/useDialog';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function FrequentUrlDialog({ handleClose, open, setOpen }) {
  const { dialogOpen, handleOpen, handleClose: handleAddFrequentUrlClose } = useDialog();
  const { t } = useTranslation();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={t('dialogs.addBookmark.title')}
      onAdd={handleOpen}
    >
      <AddOrEditFrequentUrlDialog open={dialogOpen} handleClose={handleAddFrequentUrlClose} />
      <FrequentUrlContent />
    </CustomDialog>
  );
}
