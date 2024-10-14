import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';

const DialogTitleBar = ({ title }) => (
  <DialogTitle 
    sx={{ backgroundColor: (theme) => theme.palette.primary.light, color: (theme) => theme.palette.primary.contrastText }}>
    {title}
  </DialogTitle>
);

export default DialogTitleBar;
