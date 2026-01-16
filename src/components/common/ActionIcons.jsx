import React from 'react';
import { Box } from '@mui/material';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

const ActionIcons = ({ onEdit, onDelete, stopPropagation = false }) => {
  const handleClick = callback => event => {
    if (stopPropagation) {
      event.stopPropagation();
    }
    if (callback) {
      callback(event);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <EditNoteOutlinedIcon
        fontSize="inherit"
        color="info"
        data-testid="edit-icon"
        sx={{
          justifyContent: 'flex-end',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.3)',
            cursor: 'pointer',
          },
        }}
        onClick={handleClick(onEdit)}
      />
      <DeleteIcon
        fontSize="inherit"
        color="warning"
        data-testid="delete-icon"
        sx={{
          transition: 'transform 0.2s ease-in-out',
          justifyContent: 'flex-end',
          '&:hover': {
            transform: 'scale(1.3)',
            cursor: 'pointer',
          },
        }}
        onClick={handleClick(onDelete)}
      />
    </Box>
  );
};

export default ActionIcons;
