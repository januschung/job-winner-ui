import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';

// Edit / delete buttons for a list item. `name` makes the accessible labels
// specific ("Edit LinkedIn Jobs"); `stopPropagation` keeps clicks from also
// toggling a surrounding control such as an accordion.
const ActionIcons = ({ onEdit, onDelete, name, stopPropagation = false }) => {
  const { t } = useTranslation();
  const handleClick = callback => event => {
    if (stopPropagation) event.stopPropagation();
    callback?.(event);
  };
  const label = action =>
    name ? t(`common.${action}Item`, { name }) : t(`common.${action}`);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Tooltip title={t('common.edit')}>
        <IconButton
          size="small"
          aria-label={label('edit')}
          onClick={handleClick(onEdit)}
          sx={{ borderRadius: 2, color: 'text.secondary' }}
        >
          <EditOutlinedIcon fontSize="small" data-testid="edit-icon" />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('common.delete')}>
        <IconButton
          size="small"
          aria-label={label('delete')}
          onClick={handleClick(onDelete)}
          sx={{
            borderRadius: 2,
            color: 'text.secondary',
            '&:hover': { color: 'error.main' },
          }}
        >
          <DeleteOutlinedIcon fontSize="small" data-testid="delete-icon" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionIcons;
