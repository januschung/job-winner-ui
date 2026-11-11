import { useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Portal from '@mui/material/Portal';

// How long a message stays up. Errors stay until dismissed, so one is never
// missed (WCAG 2.2.1: no time limit on reading what went wrong).
export const AUTO_HIDE_MS = 4000;

export default function SnackbarComponent({
  open,
  message,
  severity = 'success',
  onClose,
}) {
  const ref = useRef(null);
  const persistent = severity === 'error';

  // Dialogs hide the rest of the page from screen readers, and re-hide it
  // whenever one of them opens or closes, which can catch a message already
  // on screen (e.g. a failed delete reported as its confirm dialog closes).
  // Keep the message exposed for as long as it shows.
  useEffect(() => {
    const el = ref.current;
    if (!open || !el) return undefined;
    const unhide = () => {
      if (el.hasAttribute('aria-hidden')) el.removeAttribute('aria-hidden');
    };
    unhide();
    const observer = new MutationObserver(unhide);
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['aria-hidden'],
    });
    return () => observer.disconnect();
  }, [open, message]);

  // A click elsewhere dismisses a passing message, but not an error.
  const handleClose = (event, reason) => {
    if (reason === 'clickaway' && persistent) return;
    onClose?.(event, reason);
  };

  // Portaled to the end of <body>, after any dialog, for the same reason.
  // Bottom-left keeps it clear of dialog headers. On phones it spans the
  // width, so it sits above the "New application" button there.
  return (
    <Portal>
      <Snackbar
        ref={ref}
        open={open}
        autoHideDuration={persistent ? null : AUTO_HIDE_MS}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        sx={{ bottom: { xs: 88, sm: 24 } }}
      >
        <Alert
          severity={severity}
          onClose={onClose}
          variant="outlined"
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 3,
            alignItems: 'center',
            minWidth: { sm: 288 },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Portal>
  );
}
