import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';

const DialogTitleBar = ({ title }) => {
  return (
    <DialogTitle
      sx={{
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
      }}
    >
      {title}
    </DialogTitle>
  );
};

export default DialogTitleBar;
