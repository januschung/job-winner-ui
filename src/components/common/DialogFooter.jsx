import Box from '@mui/material/Box';

// Bottom bar of a dialog: an optional note on the left, actions on the right.
// On phones the actions stretch to share the full width.
export default function DialogFooter({ note, children }) {
  return (
    <Box
      sx={{
        display: 'flex',
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
