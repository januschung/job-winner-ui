import React from 'react';
import Dialog from '@mui/material/Dialog';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogTitleBar from './DialogTitleBar';
import QuestionContent from './QuestionContent';
import useDialog from './hooks/useDialog';
import AddOrEditQuestionDialog from './AddOrEditQuestionDialog';


export default function QuestionDialog({ handleClose, open, setOpen }) {

  const { dialogOpen, handleOpen, handleClose: handleAddQuestionClose } = useDialog();

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
      <AddOrEditQuestionDialog open={dialogOpen} handleClose={handleAddQuestionClose} />
      <DialogTitleBar title={'Q&A'} />            
        <QuestionContent />
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
