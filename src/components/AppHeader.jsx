import React, { useEffect, useState } from 'react';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useMediaQuery, useTheme } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import useHeaderActions from '../hooks/useHeaderActions';
import { useAppDialogs } from './AppDialogsContext';
import MobileMenu from './MobileMenu';
import SearchBar from './SearchBar';
import { useColorMode } from './ThemeContext';
import UserMenu from './UserMenu';

function Logo() {
  const { t } = useTranslation();
  return (
    <Box
      component="a"
      href="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        color: 'text.primary',
        textDecoration: 'none',
        flexShrink: 0,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          display: 'grid',
          placeItems: 'center',
          color: '#FFFFFF',
          background: theme =>
            `linear-gradient(135deg, ${theme.vars.palette.primary.dark}, ${theme.vars.palette.secondary.main})`,
        }}
      >
        <EmojiEventsIcon sx={{ fontSize: 20 }} />
      </Box>
      <Typography
        component="span"
        sx={{ fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' }}
      >
        {t('appHeader.appTitle')}
      </Typography>
    </Box>
  );
}

export default function AppHeader({ searchTerm, onSearch }) {
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const { mode, toggleColorMode } = useColorMode();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { openNewJobApplication } = useAppDialogs();
  const actions = useHeaderActions();

  const colorModeLabel =
    mode === 'dark' ? t('appHeader.lightMode') : t('appHeader.darkMode');

  useEffect(() => {
    if (isDesktop && mobileMoreAnchorEl) {
      setMobileMoreAnchorEl(null);
    }
  }, [isDesktop, mobileMoreAnchorEl]);

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          top: 0,
          color: 'text.primary',
          bgcolor: theme =>
            `rgba(${theme.vars.palette.background.defaultChannel} / 0.8)`,
          backdropFilter: 'blur(12px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ position: 'relative', gap: 2 }}>
          <Logo />
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              flex: 1,
              maxWidth: 420,
              ml: 2,
            }}
          >
            <SearchBar onSearch={onSearch} value={searchTerm} />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {actions.map(({ key, label, icon, onClick, badge }) => (
              <Tooltip key={key} title={label}>
                <IconButton
                  color="inherit"
                  aria-label={label}
                  onClick={onClick}
                >
                  <Badge badgeContent={badge} color="primary">
                    {icon}
                  </Badge>
                </IconButton>
              </Tooltip>
            ))}
            <Tooltip title={colorModeLabel}>
              <IconButton
                color="inherit"
                aria-label={colorModeLabel}
                onClick={toggleColorMode}
              >
                {mode === 'dark' ? (
                  <LightModeOutlinedIcon />
                ) : (
                  <DarkModeOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={openNewJobApplication}
              sx={{ mx: 1, whiteSpace: 'nowrap' }}
            >
              {t('appHeader.newApplication')}
            </Button>
            <UserMenu />
          </Box>
          <Box
            sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
          >
            <SearchBar
              onSearch={onSearch}
              isExpanded={isSearchExpanded}
              onToggle={() => setIsSearchExpanded(!isSearchExpanded)}
              value={searchTerm}
            />
            {!isSearchExpanded && (
              <IconButton
                color="inherit"
                aria-label={t('appHeader.moreActions')}
                aria-controls={mobileMoreAnchorEl ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                onClick={event => setMobileMoreAnchorEl(event.currentTarget)}
              >
                <MoreIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
        <MobileMenu
          anchorEl={mobileMoreAnchorEl}
          onClose={() => setMobileMoreAnchorEl(null)}
          actions={actions}
          colorMode={mode}
          colorModeLabel={colorModeLabel}
          toggleColorMode={toggleColorMode}
        />
      </AppBar>
      {!isDesktop && (
        <Fab
          color="primary"
          aria-label={t('appHeader.newApplication')}
          onClick={openNewJobApplication}
          sx={{ position: 'fixed', right: 16, bottom: 16, zIndex: 'appBar' }}
        >
          <AddRoundedIcon />
        </Fab>
      )}
    </>
  );
}
