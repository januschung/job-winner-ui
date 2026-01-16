import React from 'react';
import QuestionContent from './QuestionContent';
import useDialog from '../hooks/useDialog';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';
import CustomDialog from './common/CustomDialog';
import { useTranslation } from 'react-i18next';

export default function QuestionDialog({ handleClose, open, setOpen }) {
  const {
    dialogOpen,
    handleOpen,
    handleClose: handleAddQuestionClose,
  } = useDialog();
  const { t } = useTranslation();

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title={t('dialogs.question.title')}
      onAdd={handleOpen}
    >
      <AddOrEditQuestionDialog
        open={dialogOpen}
        handleClose={handleAddQuestionClose}
      />
      <QuestionContent />
    </CustomDialog>
  );
}
