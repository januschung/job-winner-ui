import { useId } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

// Confirmation for a destructive action. `title` and `content` arrive
// already translated.
function ConfirmDialog({ open, onCancel, onConfirm, title, content }) {
  const { t } = useTranslation();
  const titleId = useId();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      aria-labelledby={titleId}
    >
      <Box sx={{ display: 'flex', gap: 2, p: 3, pb: 1 }}>
        <Box
          aria-hidden
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: 'error.main',
            bgcolor: theme =>
              `rgba(${theme.vars.palette.error.mainChannel} / 0.12)`,
          }}
        >
          <DeleteOutlinedIcon />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: '1.125rem', fontWeight: 700, mt: 0.25, mb: 0.75 }}
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2.5 }}>
        <Button color="inherit" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          {t('common.delete')}
        </Button>
      </Box>
    </Dialog>
  );
}

export default ConfirmDialog;
