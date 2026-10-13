import { useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Portal from '@mui/material/Portal';

export default function SnackbarComponent({
  open,
  message,
  severity = 'success',
  onClose,
}) {
  const ref = useRef(null);

  // An open dialog hides the rest of the page from screen readers, including
  // a message still on screen from before it opened. Each new message is
  // announced, so make sure it is not hidden.
  useEffect(() => {
    if (open) ref.current?.removeAttribute('aria-hidden');
  }, [open, message]);

  // Portaled to the end of <body>, after any dialog, for the same reason.
  return (
    <Portal>
      <Snackbar
        ref={ref}
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={severity} onClose={onClose} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </Portal>
  );
}
