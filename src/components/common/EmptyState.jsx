import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Centered placeholder for lists with nothing to show.
export default function EmptyState({ icon, title, description, actions }) {
  return (
    <Box
      role="status"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 1.25,
        px: 3,
        py: 5,
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3.5,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          color: 'primary.main',
          bgcolor: theme =>
            `rgba(${theme.vars.palette.primary.mainChannel} / 0.12)`,
          '& svg': { fontSize: 28 },
        }}
      >
        {icon}
      </Box>
      <Typography component="h2" variant="h6" sx={{ mt: 0.75 }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360, lineHeight: 1.5 }}
        >
          {description}
        </Typography>
      )}
      {actions && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            mt: 0.75,
          }}
        >
          {actions}
        </Box>
      )}
    </Box>
  );
}
