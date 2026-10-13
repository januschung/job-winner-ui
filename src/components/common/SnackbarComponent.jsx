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
