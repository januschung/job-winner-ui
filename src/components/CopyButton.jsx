import React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';

const CopyButton = ({ text }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <IconButton onClick={handleCopy} size="small" edge="end">
      <ContentCopyOutlinedIcon fontSize="small" />
    </IconButton>
  );
};

export default CopyButton;
