import React from 'react';
import Dialog from '@mui/material/Dialog';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitleBar from '../DialogTitleBar';
import { useTranslation } from 'react-i18next';

export default function CustomDialog({ 
  open,
  onClose,
  title, 
  children, 
  maxWidth = 'md',
  onCancel = null,
  onAdd = null,
  onSave = null
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{
        backdrop: { sx: { backdropFilter: 'blur(8px)' } },
      }}
    >
      <DialogTitleBar title={title} />
      {children}
      <DialogActions>
        {onCancel && (
          <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={onClose}>
            {t('common.cancel')}
          </Button>
        )}
        {onAdd && (
          <Button color="info" variant="contained" startIcon={<AddCircleIcon />} onClick={onAdd}>
            {t('common.add')}
          </Button>
        )}
        {onSave && (
          <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
            {t('common.save')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
