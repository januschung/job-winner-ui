import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

// Bottom bar of a dialog: an optional note on the left, actions on the right.
// On phones the actions stretch to share the full width.
//
// `error` shows above the actions, next to the button that caused it and
// visible however far the dialog is scrolled. `errorAction` (e.g. a Retry
// button) sits inside it; `onErrorClose` adds a dismiss button.
export default function DialogFooter({
  note,
  error,
  errorAction,
  onErrorClose,
  children,
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 1,
        px: { xs: 2, sm: 3 },
        py: { xs: 1.5, sm: 1.75 },
        borderTop: 1,
        borderColor: 'divider',
        '& > .MuiButton-root': { flex: { xs: 1, sm: '0 0 auto' } },
      }}
    >
      {error && (
        <Alert
          severity="error"
          action={errorAction}
          onClose={errorAction ? undefined : onErrorClose}
          sx={{ flexBasis: '100%', py: 0.25 }}
        >
          {error}
        </Alert>
      )}
      {note && (
        <Box
          sx={{
            mr: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            color: 'text.secondary',
            typography: 'body2',
          }}
        >
          {note}
        </Box>
      )}
      {children}
    </Box>
  );
}
