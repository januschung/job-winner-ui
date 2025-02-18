import React from 'react';
import QuestionContent from './QuestionContent';
import useDialog from '../hooks/useDialog';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';
import CustomDialog from './common/CustomDialog';

export default function QuestionDialog({ handleClose, open, setOpen }) {

  const { dialogOpen, handleOpen, handleClose: handleAddQuestionClose } = useDialog();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title='Q&A'
      onAdd={handleOpen}
    >
      <AddOrEditQuestionDialog open={dialogOpen} handleClose={handleAddQuestionClose} />
      <QuestionContent />
    </CustomDialog>
  );
}
