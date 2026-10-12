import React from 'react';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { useAppDialogs } from './AppDialogsContext';
import { useLanguageMenuItems } from './LanguageMenuItems';
import { GITHUB_URL } from './UserMenu';

// Small-screen counterpart of the header actions and the account menu.
// "New application" lives in the floating action button instead.
export default function MobileMenu({
  anchorEl,
  onClose,
  actions,
  colorMode,
  colorModeLabel,
  toggleColorMode,
}) {
  const { t } = useTranslation();
  const { openProfile } = useAppDialogs();
  const languageItems = useLanguageMenuItems(onClose);

  const run = callback => () => {
    onClose();
    callback();
  };

  return (
    <Menu
      id="mobile-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { minWidth: 240 } } }}
    >
      {actions.map(({ key, label, icon, onClick, badge }) => (
        <MenuItem key={key} onClick={run(onClick)}>
          <ListItemIcon>
            <Badge badgeContent={badge} color="primary">
              {icon}
            </Badge>
          </ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </MenuItem>
      ))}
      <MenuItem onClick={run(toggleColorMode)}>
        <ListItemIcon>
          {colorMode === 'dark' ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </ListItemIcon>
        <ListItemText>{colorModeLabel}</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={run(openProfile)}>
        <ListItemIcon>
          <PersonOutlinedIcon />
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
        onClick={onClose}
      >
        <ListItemIcon>
          <GitHubIcon />
        </ListItemIcon>
        <ListItemText>{t('appHeader.githubLink')}</ListItemText>
      </MenuItem>
    </Menu>
  );
}
