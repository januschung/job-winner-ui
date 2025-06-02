import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

function ConfirmDialog({ open, onCancel, onConfirm, title, content }) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{t(title)}</DialogTitle>
      <DialogContent>{t(content)}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('common.cancel')}</Button>
        <Button onClick={onConfirm} color="primary">
          {t('common.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
