import { useId } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import DialogFooter from './DialogFooter';

// Shared dialog frame: plain header (title, optional subtitle and header
// element, close button) and a footer with the dialog's actions. Full screen
// on phones.
export default function CustomDialog({
  open,
  onClose,
  title,
  subtitle,
  headerAction,
  children,
  maxWidth = 'md',
  onCancel = null,
  onAdd = null,
  onSave = null,
  // Disables the primary action while a save is in flight.
  saving = false,
  saveLabel,
  addLabel,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const titleId = useId();

  const closeButton = (
    <IconButton
      onClick={onClose}
      aria-label={t('common.close')}
      sx={{ color: 'text.secondary', borderRadius: 2.5, flexShrink: 0 }}
    >
      <CloseRoundedIcon />
    </IconButton>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)' } } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: 1.5,
          pl: { xs: 1, sm: 3 },
          pr: { xs: 2, sm: 3 },
          pt: { xs: 1, sm: 2.25 },
          pb: { xs: 1, sm: 1.75 },
          borderBottom: { xs: 1, sm: 0 },
          borderColor: 'divider',
        }}
      >
        {fullScreen && closeButton}
        <Box sx={{ flex: 1, minWidth: 0, pt: { sm: 0.25 } }}>
          <Typography
            id={titleId}
            component="h2"
            sx={{ fontSize: '1.125rem', fontWeight: 700, lineHeight: 1.35 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {headerAction && <Box sx={{ pt: { sm: 0.5 } }}>{headerAction}</Box>}
        {!fullScreen && closeButton}
      </Box>
      {children}
      {(onCancel || onAdd || onSave) && (
        <DialogFooter>
          {onCancel && (
            <Button color="inherit" onClick={onClose}>
              {t(onSave ? 'common.cancel' : 'common.close')}
            </Button>
          )}
          {onAdd && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={onAdd}
              disabled={saving}
            >
              {addLabel ?? t('common.add')}
            </Button>
          )}
          {onSave && (
            <Button variant="contained" onClick={onSave} disabled={saving}>
              {saveLabel ?? t('common.save')}
            </Button>
          )}
        </DialogFooter>
      )}
    </Dialog>
  );
}
