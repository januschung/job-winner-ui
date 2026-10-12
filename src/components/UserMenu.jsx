import React, { useState } from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { useAppDialogs } from './AppDialogsContext';
import { useLanguageMenuItems } from './LanguageMenuItems';

export const GITHUB_URL = 'https://github.com/januschung/job-winner-ui';

const initials = name =>
  name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function UserMenu() {
  const { t } = useTranslation();
  const { openProfile, profileName } = useAppDialogs();
  const [anchorEl, setAnchorEl] = useState(null);
  const close = () => setAnchorEl(null);
  const languageItems = useLanguageMenuItems(close);

  return (
    <>
      <Tooltip title={t('appHeader.accountMenu')}>
        <IconButton
          onClick={event => setAnchorEl(event.currentTarget)}
          aria-label={t('appHeader.accountMenu')}
          aria-controls={anchorEl ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? 'true' : undefined}
          sx={{ p: 0.5 }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.875rem',
              fontWeight: 600,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            }}
          >
            {profileName ? (
              initials(profileName)
            ) : (
              <PersonOutlinedIcon fontSize="small" />
            )}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        <MenuItem
          onClick={() => {
            close();
            openProfile();
          }}
        >
          <ListItemIcon>
            <PersonOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('appHeader.profile')}</ListItemText>
        </MenuItem>
        <Divider />
        {languageItems}
        <Divider />
        <MenuItem
          component="a"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={close}
        >
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('appHeader.githubLink')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
