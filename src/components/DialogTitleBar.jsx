import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import { useTheme } from "@mui/material/styles";

const DialogTitleBar = ({ title }) => {
  const theme = useTheme();

  return (
    <DialogTitle
      sx={{
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.primary.contrastText,
      }}
    >
      {title}
    </DialogTitle>
  );
};

export default DialogTitleBar;
