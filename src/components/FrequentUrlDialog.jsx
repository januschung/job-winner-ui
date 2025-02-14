import React from 'react';
import Dialog from '@mui/material/Dialog';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitleBar from './DialogTitleBar';
import FrequentUrlContent from './FrequentUrlContent';
import useDialog from './hooks/useDialog';
import AddOrEditFrequentUrlDialog from './AddOrEditFrequentUrlDialog';


export default function FrequentUrlDialog({ handleClose, open, setOpen }) {

  const { dialogOpen, handleOpen, handleClose: handleAddFrequentUrlClose } = useDialog();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      height="lg"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)'
          },
        },
      }}
    >
      <AddOrEditFrequentUrlDialog open={dialogOpen} handleClose={handleAddFrequentUrlClose} />
      <DialogTitleBar title={'Bookmarks'} />            
        <FrequentUrlContent />
        <DialogActions>
          <Button color="info" variant="outlined" startIcon={<CancelIcon />} onClick={handleClose}>
            Cancel
          </Button>
          <Button color="info" variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpen}>
            Add
          </Button>
      </DialogActions>
    </Dialog>
  );
}
