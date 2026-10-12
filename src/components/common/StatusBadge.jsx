import Box from '@mui/material/Box';
import { statusColor } from '../../config/status';

// Small tinted pill: colored dot + label, in one of the status tones
// (all/open/active/ghosted/rejected) from the theme palette.
export default function StatusBadge({ tone, label }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1.25,
        borderRadius: 999,
        flexShrink: 0,
        fontSize: '0.75rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: statusColor(tone, 'soft', 'action.hover'),
        color: statusColor(tone, 'text', 'text.secondary'),
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: statusColor(tone, 'main', 'text.disabled'),
        }}
      />
      {label}
    </Box>
  );
}
