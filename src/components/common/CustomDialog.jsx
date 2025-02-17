import React from 'react';
import Dialog from '@mui/material/Dialog';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitleBar from '../DialogTitleBar';

export default function CustomDialog({ 
  open,
  onClose,
  title, 
  children, 
  maxWidth='md',
  onCancel = null,
  onAdd = null,
  onSave = null
}) {
  
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
            Cancel
          </Button>
        )}
        {onAdd && (
          <Button color="info" variant="contained" startIcon={<AddCircleIcon />} onClick={onAdd}>
            Add
          </Button>
        )}
        {onSave && (
          <Button color="info" variant="contained" startIcon={<SaveIcon />} onClick={onSave}>
            Save
          </Button>
        )}
      </DialogActions>

    </Dialog>
  );
}
