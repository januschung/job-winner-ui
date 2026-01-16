import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Brightness4, Brightness7, GitHub } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useTranslation } from 'react-i18next';

export default function MobileMenu({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  handleProfileMenuOpen,
  handleJobApplicationOpen,
  handleFrequentUrlsDialogOpen,
  handleQuestionDialogOpen,
  handleInterviewListDialogOpen,
  handleOfferListDialogOpen,
  interviewCount,
  offerCount,
  colorMode,
  toggleColorMode,
  i18n,
}) {
  const { t } = useTranslation();
  const mobileMenuId = 'primary-search-account-menu-mobile';

  const [languageMenuAnchorEl, setLanguageMenuAnchorEl] = useState(null);

  const handleLanguageMenuOpen = event => {
    setLanguageMenuAnchorEl(event.currentTarget); // Set the anchor to the "Select Language" menu item
  };

  const handleLanguageMenuClose = () => {
    setLanguageMenuAnchorEl(null);
  };

  const handleLanguageChange = language => {
    i18n.changeLanguage(language);
    handleLanguageMenuClose();
  };

  return (
    <>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem onClick={handleJobApplicationOpen}>
          <IconButton
            size="large"
            aria-label={t('appHeader.newJobApplication')}
            color="inherit"
          >
            <AddCircleIcon />
          </IconButton>
          <p>{t('appHeader.newJobApplication')}</p>
        </MenuItem>
        <MenuItem onClick={handleFrequentUrlsDialogOpen}>
          <IconButton
            size="large"
            aria-label={t('appHeader.bookmarks')}
            color="inherit"
          >
            <BookmarksIcon />
          </IconButton>
          <p>{t('appHeader.bookmarks')}</p>
        </MenuItem>
        <MenuItem onClick={handleQuestionDialogOpen}>
          <IconButton
            size="large"
            aria-label={t('appHeader.qa')}
            color="inherit"
          >
            <QuestionAnswerIcon />
          </IconButton>
          <p>{t('appHeader.qa')}</p>
        </MenuItem>
        <MenuItem onClick={handleInterviewListDialogOpen}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={interviewCount} color="error">
              <EventAvailableIcon />
            </Badge>
          </IconButton>
          <p>{t('appHeader.interviewList')}</p>
        </MenuItem>
        <MenuItem onClick={handleOfferListDialogOpen}>
          <IconButton size="large" color="inherit">
            <Badge badgeContent={offerCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>{t('appHeader.offerList')}</p>
        </MenuItem>
        <MenuItem onClick={toggleColorMode}>
          <IconButton size="large" color="inherit">
            {colorMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <p>
            {colorMode === 'dark'
              ? t('appHeader.lightMode')
              : t('appHeader.darkMode')}
          </p>
        </MenuItem>
        <MenuItem
          component="a"
          href="https://github.com/januschung/job-winner-ui"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton size="large" color="inherit">
            <GitHub />
          </IconButton>
          <p>{t('appHeader.githubLink')}</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            size="large"
            aria-label={t('appHeader.profile')}
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>{t('appHeader.profile')}</p>
        </MenuItem>
        <MenuItem onClick={handleLanguageMenuOpen}>
          <IconButton size="large" color="inherit">
            <ChevronRightIcon />
          </IconButton>
          <p>{t('appHeader.selectLanguage')}</p>
        </MenuItem>
      </Menu>

      {/* Submenu for Language Selection */}
      <Menu
        anchorEl={languageMenuAnchorEl} // Anchor the submenu to the "Select Language" menu item
        anchorOrigin={{
          vertical: 'bottom', // Position the submenu directly below the "Select Language" menu item
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(languageMenuAnchorEl)}
        onClose={handleLanguageMenuClose}
      >
        <MenuItem onClick={() => handleLanguageChange('en')}>EN</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('es')}>ES</MenuItem>
      </Menu>
    </>
  );
}
